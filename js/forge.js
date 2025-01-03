import { setStatus, addHandlers, loadFromStorage, saveToStorage, 
    createElement, addColumn, formatNumber } from './hp_common.js';
import { bazaarDownload, bazaarUpdate} from './bazaar.mjs'
let config;
let prices = { last_updated: 0, products: {} };
let goods = new Set();
let currentInterval;
let selectedMenu;

const lsPrefix = 'hp_frg_'
const collapsetime = 80;
const collapseState = { itemsCount: 0 };

function calcRecipe(recipeId) {
    const recipe = config.recipes[recipeId];
    if (recipe.craft_price !== undefined) return;
    recipe.craft_price = 0;
    recipe.result_craft_time = recipe.craft_time;
    recipe.buy_price = prices.products[recipeId]?.buy_price;
    recipe.sell_price = prices.products[recipeId]?.sell_price;
    for (const component of recipe.components) {
        component.buy_price = prices.products[component.id]?.buy_price;
        component.sell_price = prices.products[component.id]?.sell_price;
        const source = component.source ?? 'sell';
        const compRecipe = config.recipes[component.id];
        if (compRecipe !== undefined) {
            if (compRecipe.craft_price === undefined) calcRecipe(component.id);
            component.craft_price = compRecipe.craft_price;
            component.craft_time = source === 'craft' ? compRecipe.craft_time * component.count : undefined;
        }

        component.result_price = (component[source + '_price'] ?? 0) * component.count;

        recipe.craft_price += component.result_price;
        recipe.result_craft_time += component.craft_time ?? 0;
    }
    for (const component of recipe.components) 
        component.percent = recipe.craft_price === 0 ? undefined : 100 * component.result_price / recipe.craft_price;
}

function updateCraft() {
    Object.values(config.recipes).forEach(elem => elem.craft_price = undefined);
    Object.keys(config.recipes).forEach(recipeId => calcRecipe(recipeId));
}

function drawElem(elem) {
    const recipe = config.recipes[elem.getAttribute('hypixel-id')] ?? {};
    elem.childNodes[3].textContent = formatNumber(recipe.sell_price);
    elem.childNodes[4].textContent = formatNumber(recipe.buy_price);
    elem.childNodes[7].textContent = formatNumber(recipe.craft_price);
    elem.childNodes[8].textContent = formatNumber(recipe.result_craft_time);
    for (const component of recipe.components) {
        elem = elem.nextSibling;
        elem.childNodes[3].textContent = formatNumber(component.sell_price);
        elem.childNodes[4].textContent = formatNumber(component.buy_price);
        elem.childNodes[5].textContent = formatNumber(component.craft_price);
        elem.childNodes[6].firstChild.value = component.source ?? 'sell';
        elem.childNodes[7].textContent = formatNumber(component.result_price);
        elem.childNodes[8].textContent = formatNumber(component.craft_time);
        elem.childNodes[9].textContent = formatNumber(component.percent);
    }
}

function drawPage() {
    const recipeElems = document.querySelectorAll(`*[hypixel-id]`);
    recipeElems.forEach(elem => drawElem(elem));
}

function updateMarket(data) {
    if (!data.success) return marketSchedule({ message: 'Error loading market data' });
    marketSchedule();
    bazaarUpdate(goods, data, prices);
    updateCraft();
    drawPage();
}

function downloadMarket() {
    bazaarDownload().catch(marketSchedule).then(updateMarket);
}

function marketSchedule(error) {
    const updatedUnsuccessfully = error !== undefined;
    if (updatedUnsuccessfully) setStatus(error.message);
    if (currentInterval) clearInterval(currentInterval);
    currentInterval = setInterval(downloadMarket, updatedUnsuccessfully? 20000: 650000 );
}

function saveConfig() {
    saveToStorage(lsPrefix + 'config', JSON.stringify(config));
}

function sourceChange(event) {
    const row = this.parentElement.parentElement;
    const [recipe_id, idx] = row.getAttribute('component-link').split(',');
    const recipe = config.recipes[recipe_id];
    const component = recipe.components[idx];
    component.source = this.value;
    updateCraft();
    saveConfig();
    drawPage();
}

function collapseTick() {
    if (collapseState.itemsCount === 0) return;
    if (!collapseState.collapse) {
        collapseState.item.classList.remove('d-none');
        collapseState.item = collapseState.item.nextSibling;
    } else {
        collapseState.item.classList.add('d-none');
        collapseState.item = collapseState.item.previousSibling;
    }
    if (--collapseState.itemsCount > 0) setTimeout(collapseTick, collapseState.interval);
}

function findPage(menuName = selectedMenu) {
    for (let page of config.pages) {
        if (page.name === menuName) return page;     
    }
}

function findElement(searchElement, page) {
    for (let element of page.elements) {
        if (searchElement.id === element.id) return element;
    }
}

function rowClick(event) {
    if (collapseState.itemsCount > 0) return;
    const item_id = this.getAttribute('hypixel-id');
    const idx = this.getAttribute('index');
    collapseState.itemsCount = config.recipes[item_id].components.length;
    collapseState.interval = collapsetime / collapseState.itemsCount;
    collapseState.item = this.nextSibling;
    collapseState.collapse = !(this.getAttribute('collapsed') === 'true');
    this.setAttribute('collapsed', collapseState.collapse);
    const page = findPage();
    if (page !== undefined) page.elements[idx].collapsed = collapseState.collapse;
    saveConfig();
    if (collapseState.collapse) {
        for (let i = 0; i < collapseState.itemsCount - 1; i++) {
            collapseState.item = collapseState.item.nextSibling;
        }
    }
    setTimeout(collapseTick, collapseState.interval);
}

function createRow(page_elem, component = undefined, index = 0) {
    const item = config.recipes[page_elem.id];
    const header = component === undefined;
    const newRow = createElement('tr', [header? 'table-info': (page_elem.collapsed ? 'd-none' : '')], 
        header? {"hypixel-id": page_elem.id, "collapsed": page_elem.collapsed ?? 'false', "index": page_elem.idx} : 
        {"component-link": page_elem.id + ',' + index});
    if (header) newRow.addEventListener('click', rowClick);
    newRow.appendChild(createElement('th', ["text-start"], {}, header? (item?.name ?? page_elem.id): component.id));
    addColumn(newRow, header? item?.craft_time: undefined);
    addColumn(newRow, header? item.count : component.count);
    addColumn(newRow, undefined, ['table-secondary']);
    addColumn(newRow, undefined, ['table-secondary']);
    addColumn(newRow, undefined, ['table-secondary']);
    const srcCol = createElement('td');
    if (component) {
        const select = createElement('select', ['form-select', 'py-0', 'pe-0']);
        select.appendChild(createElement('option', [], {}, 'sell'));
        select.appendChild(createElement('option', [], {}, 'buy'));
        const disabled = config.recipes[component.id] === undefined ? { disabled : '' } : {} ;
        select.appendChild(createElement('option', [], disabled, 'craft'));
        select.appendChild(createElement('option', [], {}, 'own'));
        select.addEventListener('change', sourceChange);
        srcCol.appendChild(select);
    }
    newRow.appendChild(srcCol);
    addColumn(newRow, undefined);
    addColumn(newRow, undefined);
    addColumn(newRow, undefined);
    return newRow;
}

function formPage() {
    const page = findPage();
    if (page === undefined) return;

    const elements = [];
    page.elements.forEach((element, idx) => {
        const item = config.recipes[element.id];
        if (item !== undefined) {
            element.idx = idx;
            elements.push(createRow(element));
            item.components.forEach((component, idx) => elements.push(createRow(element, component, idx)));
        }
    });

    document.getElementById('tForge').replaceChildren(...elements);
}

function updateConfig(response) {
    // restore collapsed and source values
    for (let page of response.pages) {
        const oldPage = findPage(page.name);
        if (oldPage !== undefined) {
            for (let element of page.elements) {
                const oldElement = findElement(element, oldPage);
                if (oldElement !== undefined) {
                    element.collapsed = oldElement.collapsed;
                }
            }
        }
    }
    for (const [item_id, recipe] of Object.entries(response.recipes)) {
        const oldRecipe = config.recipes[item_id];
        if (oldRecipe !== undefined) {
            recipe.components.forEach((component, idx) => component.source = oldRecipe.components[idx]?.source);
        }
    }
    config = response;
    // update bazaar goods
    goods.clear();
    for (const [recipeId, recipe] of Object.entries(config.recipes)) {
        goods.add(recipeId);
        recipe.components.forEach(item => goods.add(item.id));
    }
    // form navigation
    if (findPage() === undefined) selectedMenu = config.pages.length > 0? config.pages[0].name: '';
    const elements = [];
    for (const page of config.pages) {
        const newRow = createElement('li', ["nav-item"], { role: "presentation" });
        elements.push(newRow);
        const isActive = selectedMenu === page.name;
        const newBtn = createElement('button', ['nav-link', isActive? 'active' : ''], {
            "data-bs-toggle": "pill",
            "type": "button",
            "aria-selected": isActive
        }, page.name);
        newRow.appendChild(newBtn);
    }
    document.getElementById('nForgeMenu').replaceChildren(...elements);
    formPage();
    downloadMarket();
}

function reloadCfg() {
    fetch('json/forge.json').then(res => res.json().then(updateConfig));
}

function clickNav(item) {
    selectedMenu = item.delegateTarget.textContent;
    saveToStorage(lsPrefix + 'selected_menu', selectedMenu);
    formPage();
    drawPage();
}

function init() {
    addHandlers({
        'click-reloadcfg': reloadCfg,
        'click-navigation': clickNav
    })
    selectedMenu = loadFromStorage(lsPrefix + "selected_menu");
    const conf_str = loadFromStorage(lsPrefix + 'config');
    if (conf_str) config = JSON.parse(conf_str);
    reloadCfg();
}

init();