import { setStatus, addHandlers, loadFromStorage, saveToStorage, createElement, addColumn } from './hp_common.js';
import { bazaarDownload, bazaarUpdate} from './bazaar.mjs'
let config;
let prices = { last_updated: 0, products: {} };
let goods = new Set();
let currentInterval;
let selectedMenu;

const lsPrefix = 'hp_frg_'

function updateCraft() {
    
}

function updateMarket(data) {
    if (!data.success) return marketSchedule({ message: 'Error loading market data' });
    marketSchedule();
    bazaarUpdate(goods, data, prices);
    updateCraft();
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

function updateConfig(response) {
    config = response;
    // update bazaar goods
    goods.clear();
    for (const [recipeId, recipe] of Object.entries(config.recipes)) {
        goods.add(recipeId);
        recipe.components.forEach(item => goods.add(item.id));
    }
    // form navigation
    if (config.pages.every(elem => elem.name !== selectedMenu)) {
        selectedMenu = config.pages.length > 0? config.pages[0].name: '';
    }
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

function createRow(item_id, count = 1, header = false) {
    const item = config.recipes[item_id];
    const newRow = createElement('tr', [header? 'table-info': ''], {"hypixel-id": item_id});
    newRow.appendChild(createElement('th', ["text-start"], {}, item?.name ?? item_id));
    addColumn(newRow, item?.craft_time);
    addColumn(newRow, count);
    addColumn(newRow, undefined, ['table-secondary']);
    addColumn(newRow, undefined, ['table-secondary']);
    addColumn(newRow, undefined, ['table-secondary']);
    addColumn(newRow, header ? undefined : 'craft');
    addColumn(newRow, undefined);
    addColumn(newRow, undefined);
    addColumn(newRow, undefined);
    return newRow;
}

function formPage() {
    let page;
    config.pages.forEach(element => {
        if (element.name === selectedMenu) page = element;
    });
    if (page === undefined) return;
    const elements = [];
    for (const element of page.elements) {
        const item = config.recipes[element.id];
        if (item === undefined) continue;
        elements.push(createRow(element.id, item.count, true));
        for (const component of item.components) {
            elements.push(createRow(component.id, component.count));  
        }
    }
    document.getElementById('tForge').replaceChildren(...elements);

}

function reloadCfg() {
    fetch('json/forge.json').then(res => res.json().then(updateConfig));
}

function clickNav(item) {
    selectedMenu = item.delegateTarget.textContent;
    saveToStorage(lsPrefix + 'selected_menu', selectedMenu);
    formPage();
}

function init() {
    addHandlers({
        'click-reloadcfg': reloadCfg,
        'click-navigation': clickNav
    })
    selectedMenu = loadFromStorage(lsPrefix + "selected_menu");
    reloadCfg();
}

init();