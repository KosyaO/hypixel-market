const capitalize = word => word.slice(0, 1).toUpperCase() + word.slice(1);
const snakeToSpaced = text => text.split('_').map(capitalize).join(' ');
function round(float_number, digits = 0) {
    return parseFloat(float_number.toFixed(digits));
}

export const prices_filter = {
    'Artifact of Control': { buy_cheaper: 2000000000, count: 3 },
    'Spirit Mask': { buy_cheaper: 120000000, count: 3 },
    'Dark Claymore': {}
};

const roman_multipliers = { 'I': 1, 'II': 2, 'III': 4, 'IV': 8, 'V': 16, 'VI': 16, 'VII': 32, 'VIII': 64, 'IX': 128, 'X': 256 };

export const real_templates = {
    dark_claymore: {
        item_name: 'Dark Claymore',
        base_price: 188000000,
        base_tier: "LEGENDARY",
        essence: { name: 'Wither Essence', code: 'essence_wither', count: [0, 150, 450, 950, 1850, 3350] }
    },
    terminator: {
        item_name: 'Terminator',
        base_price: 599000000,
        base_tier: "LEGENDARY",
        essence: { name: 'Dragon Essence', code: 'essence_dragon', count: [0, 400, 600, 900, 1400, 2150] }
    },
    hyperion: {
        item_name: 'Hyperion',
        base_price: 940000000,
        base_tier: "LEGENDARY",
        essence: { name: 'Wither Essence', code: 'essence_wither', count: [0, 150, 450, 950, 1850, 3350] },
        abilities: {
            'Wither Shield': ['wither_shield_scroll'],
            'Shadow Warp': ['shadow_warp_scroll'],
            'Implosion': ['implosion_scroll'],
            'Wither Impact': ['wither_shield_scroll', 'shadow_warp_scroll', 'implosion_scroll']
        }
    }
};

const enchants_one = {
    'Divine Gift': 'enchantment_divine_gift_1',
    'Chimera': 'enchantment_ultimate_chimera_1',
    'Soul Eater': 'enchantment_ultimate_soul_eater_1',
    'Smoldering': 'enchantment_smoldering_1',
    'Fatal Tempo': 'enchantment_ultimate_fatal_tempo_1',
    'Duplex': 'enchantment_ultimate_reiterate_1',
    'Overload': 'enchantment_overload_1',
    'Dragon Hunter': 'enchantment_dragon_hunter_1'
};

const enchants_exact = {
    'Critical VII': 'enchantment_critical_7',
    'Cleave VI': 'enchantment_cleave_6',
    'Chance V': 'enchantment_chance_5',
    'Cubism VI': 'enchantment_cubism_6',
    'First Strike V': 'enchantment_first_strike_5',
    'Ender Slayer VII': 'enchantment_ender_slayer_7',
    'Experience V': 'enchantment_experience_5',
    'Giant Killer VII': 'enchantment_giant_killer_7',
    'Looting V': 'enchantment_looting_5',
    'Luck VII': 'enchantment_luck_7',
    'Prosecute VI': 'enchantment_prosecute_6',
    'Execute VI': 'enchantment_execute_6',
    'Scavenger V': 'enchantment_scavenger_5',
    'Sharpness VII': 'enchantment_sharpness_7',
    'Snipe IV': 'enchantment_snipe_4',
    'Syphon V': 'enchantment_syphon_5',
    'Thunderlord VII': 'enchantment_thunderlord_7',
    'Venomous VI': 'enchantment_venomous_6',
    'Vicious V': 'enchantment_vicious_5',
    'Power VII': 'enchantment_power_7'
};

const stars = {
    symbols: "➊➋➌➍➎",
    names: ['first_master_star', 'second_master_star', 'third_master_star', 'fourth_master_star', 'fifth_master_star']
}

const recomb_item = 'recombobulator_3000';

const auxiliary_items = [
    'wither_shield_scroll', 
    'shadow_warp_scroll', 
    'implosion_scroll',
    recomb_item
];

export const bazaar_items = Object.values(enchants_one).concat(Object.values(enchants_exact)).concat(stars.names).concat(auxiliary_items);

export function translate_attribute_name(short_name) {
    return {
        'bf': 'Blazing Fortune',
        'dom': 'Dominance',
        'fe': 'Fishing Exp',
        'll': 'Lifeline',
        'mf': 'Magic Find ',
        'mp': 'Mana Pool',
        'mr': 'Mana Regen',
        'spd': 'Speed ',
        'vet': 'Veteran',
        'vit': 'Vitality '
    }[short_name.toLowerCase()] ?? short_name;
}

export function generate_piece_template(piece_name, lore_entries = [], attribute_sort = false, max_price = undefined) {
    const types = ['Fervor', 'Hollow', 'Crimson', 'Aurora', 'Terror'];
    let result = {};
    lore_entries = lore_entries.map(entry => translate_attribute_name(entry));
    for (let type of types) {
        result[type + ' ' + piece_name] = {lore_entries, max_price};
    }
    result.attribute_sort = attribute_sort;
    return result;
}

export function generate_piece_attribute(piece_name, attribute_name, max_price = undefined) {
    return generate_piece_template(piece_name, [translate_attribute_name(attribute_name)], true, max_price);
}

export function generate_equip_attribute(equip_name, attribute_name, max_price = undefined) {
    let result = {attribute_sort: true};
    result[equip_name] = {lore_entries: [translate_attribute_name(attribute_name)], max_price};
    return result;
}

export function generate_armor_template(armor_name, lore_entries = [], attribute_sort = false, max_price = undefined) {
    const pieces = ['Helmet', 'Chestplate', 'Leggings', 'Boots'];
    let result = {};
    lore_entries = lore_entries.map(entry => translate_attribute_name(entry));
    for (let item of pieces) {
        result[armor_name + ' ' + item] = {lore_entries, max_price};
    }
    result.attribute_sort = attribute_sort;
    return result;
}

export function generate_armor_attributes(lore_entries = [], attribute_sort = false, max_price = undefined) {
    const pieces = ['Chestplate', 'Leggings', 'Boots'];
    const types = ['Fervor', 'Hollow', 'Crimson', 'Aurora', 'Terror'];
    let result = {};
    lore_entries = lore_entries.map(entry => translate_attribute_name(entry));
    for (let piece of pieces)
        for (let type of types) {
            result[type + ' ' + piece] = {lore_entries, max_price};
        }
    result.attribute_sort = attribute_sort;
    return result;
}

export const templates = {
    kuudra_equip: {
        'Implosion Belt': {'lore_entries': ['Mana Regen', 'Mana Pool']},
        'Molten Cloak': {'lore_entries': ['Mana Pool', 'Mana Regen']},
        'Molten Necklace': {'lore_entries': ['Mana Pool', 'Mana Regen']},
        'Molten Belt': {'lore_entries': ['Mana Pool', 'Mana Regen']},
    },
    god_fishing_noob_set: {
        'Slug Boots': {'lore_entries': ['Blazing Fortune', 'Fishing Exp']},
        'Moogma Leggings': {'lore_entries': ['Blazing Fortune', 'Fishing Exp']},
        'Flaming Chestplate': {'lore_entries': ['Blazing Fortune', 'Fishing Exp']},
        'Taurus Helmet': {'lore_entries': ['Blazing Fortune', 'Fishing Exp']}
    },
    archer_armor: {
        'Terror Chestplate': {'lore_entries':['Lifeline', 'Mana Pool']},
        'Terror Leggings': {'lore_entries':['Lifeline', 'Mana Pool']},
        'Terror Boots': {'lore_entries':['Lifeline', 'Mana Pool']}
    },
    archer_balanced: {
        'Terror Chestplate': {'lore_entries':['Dominance', 'Vitality ']},
        'Terror Leggings': {'lore_entries':['Dominance', 'Vitality ']},
        'Terror Boots': {'lore_entries':['Dominance', 'Vitality ']}
    },
    mage_armor: {
        'Aurora Chestplate': {'lore_entries':['Mana Regen', 'Mana Pool']},
        'Aurora Leggings': {'lore_entries':['Mana Regen', 'Mana Pool']},
        'Aurora Boots': {'lore_entries':['Mana Regen', 'Mana Pool']}
    },
    mage_ender: {
        'Crimson Chestplate': {'lore_entries':['Mana Pool', 'Veteran']},
        'Crimson Leggings': {'lore_entries':['Mana Pool', 'Veteran']},
        'Crimson Boots': {'lore_entries':['Mana Pool', 'Veteran']}
    },
    demon_lord_armor: {
        'Crimson Chestplate': {'lore_entries':['Veteran', 'Vitality ']},
        'Crimson Leggings': {'lore_entries':['Veteran', 'Vitality ']},
        'Crimson Boots': {'lore_entries':['Veteran', 'Vitality ']}
    },
    slayer_dps: {
        'Crimson Chestplate': {'lore_entries':['Veteran', 'Dominance']},
        'Crimson Leggings': {'lore_entries':['Veteran', 'Dominance']},
        'Crimson Boots': {'lore_entries':['Veteran', 'Dominance']}
    },
    slayer_armor: {
        'Crimson Chestplate': {'lore_entries':['Veteran', 'Magic Find ']},
        'Crimson Leggings': {'lore_entries':['Veteran', 'Magic Find ']},
        'Crimson Boots': {'lore_entries':['Veteran', 'Magic Find ']}
    },
    archer_boots: {'Terror Boots': {'lore_entries':['Lifeline', 'Mana Pool']}},
    archer_equip: {
        'Lava Shell Necklace': {'lore_entries':['Lifeline', 'Mana Pool']},
        'Molten Cloak': {'lore_entries':['Lifeline', 'Mana Pool']},
        'Molten Belt': {'lore_entries':['Lifeline', 'Mana Pool']},
        'Molten Bracelet': {'lore_entries':['Lifeline', 'Mana Pool']}
    },
    mage_equip: {
        'Implosion Belt': {'lore_entries': ['Mana Pool', 'Mana Regen']},
        'Molten Cloak': {'lore_entries': ['Mana Pool', 'Mana Regen']},
        'Molten Necklace': {'lore_entries': ['Mana Pool', 'Mana Regen']},
        'Molten Bracelet': {'lore_entries': ['Mana Pool', 'Mana Regen']},
    },
    lava_shell: { 'Lava Shell Necklace': {'lore_entries':['Lifeline', 'Mana Pool']}},
    gauntlet_of_contagion: {'Gauntlet of Contagion': {'lore_entries':['Mana Regen', 'Mana Pool']}},
    gauntlet_of_dungeon: {'Gauntlet of Contagion': {'lore_entries':['Dominance', 'Speed ']}},
    mage_boots: {'Aurora Boots': {'lore_entries': ['Mana Pool', 'Mana Regen']}},
    mage_leggings: {'Aurora Leggings': {'lore_entries': ['Mana Pool', 'Mana Regen']}},
    mage_chestplate: {'Aurora Chestplate': {'lore_entries': ['Mana Pool', 'Mana Regen']}},
    magma_rod_trophy_fast: {'Magma Rod': {'lore_entries': ['Trophy Hunter', 'Fishing Speed ']}},
    magma_rod_trophy: {'Magma Rod': {'lore_entries': ['Trophy Hunter', 'Fisherman']}},
    magma_rod_creatures: {'Magma Rod': {'lore_entries': ['Double', 'Fishing Speed ']}},
    magma_rod_fs: generate_equip_attribute('Magma Rod', 'Fishing Speed '),
    hellfire_rod_trophy: {'Hellfire Rod': {'lore_entries': ['Trophy Hunter', 'Fisherman']}},
    hellfire_rod_trophy_fast: {'Hellfire Rod': {'lore_entries': ['Trophy Hunter', 'Fishing Speed ']}},
    hellfire_rod_creatures: {'Hellfire Rod': {'lore_entries': ['Double', 'Fishing Speed ']}},

    helmet_mana_regen: generate_piece_attribute('Helmet', 'MR'),
    helmet_lifeline: generate_piece_attribute('Helmet', 'LL'),
    helmet_mf: generate_piece_attribute('Helmet', 'MF'),
    helmet_mp: generate_piece_attribute('Helmet', 'MP'),
    helmet_mr: generate_piece_attribute('Helmet', 'MR'),
    helmet_ll: generate_piece_attribute('Helmet', 'LL'),
    chestplate_mana_pool: generate_piece_attribute('Chestplate', 'MP', 20000000),
    chestplate_mana_regen: generate_piece_attribute('Chestplate', 'MR'),
    chestplate_lifeline: generate_piece_attribute('Chestplate', 'LL'),
    chestplate_magic_find: generate_piece_attribute('Chestplate', 'MF'),
    chestplate_veteran: generate_piece_attribute('Chestplate', 'Vet', 20000000),
    chestplate_vitality: generate_piece_attribute('Chestplate', 'Vit', 10000000),
    chestplate_dominance: generate_piece_attribute('Chestplate', 'Dom', 10000000),
    leggings_mana_pool: generate_piece_attribute('Leggings', 'MP'),
    leggings_mana_regen: generate_piece_attribute('Leggings', 'MR'),
    leggings_lifeline: generate_piece_attribute('Leggings', 'LL', 10000000),
    leggings_magic_find: generate_piece_attribute('Leggings', 'MF'),
    leggings_veteran: generate_piece_attribute('Leggings', 'Vet', 10000000),
    leggings_vitality: generate_piece_attribute('Leggings', 'Vit', 10000000),
    leggings_dominance: generate_piece_attribute('Leggings', 'Dom', 10000000),
    boots_mana_pool: generate_piece_attribute('Boots', 'MP', 10000000),
    boots_veteran: generate_piece_attribute('Boots', 'Vet', 15000000),
    boots_dominance: generate_piece_attribute('Boots', 'Dom', 10000000),
    boots_vitality: generate_piece_attribute('Boots', 'Vit', 15000000),
    boots_mana_regen: generate_piece_attribute('Boots', 'MR'),
    boots_lifeline: generate_piece_attribute('Boots', 'LL'),
    boots_magic_find: generate_piece_attribute('Boots', 'MF', 15000000),

    magma_lord: generate_armor_template('Magma Lord', ['Blazing Fortune', 'Fishing Exp']),
    thunder_fe: generate_armor_template('Thunder', ['Fishing Exp'], true, 10000000),
    thunder_mf: generate_armor_template('Thunder', ['Blazing Fortune'], true, 10000000),
    hollow_wand: {'Hollow Wand': {'lore_entries': ['Blazing', 'Elite']}},

    molten_bracelet: {'Molten Bracelet': {'lore_entries':['Mana Regen', 'Mana Pool']}},
    molten_bracelet_archer: {'Molten Bracelet': {'lore_entries':['Lifeline', 'Mana Pool']}},
    molten_bracelet_archer_mr: {'Molten Bracelet': {'lore_entries':['Lifeline', 'Mana Regen']}},
    molten_bracelet_mp: generate_equip_attribute('Molten Bracelet','MP'),
    molten_bracelet_mr: generate_equip_attribute('Molten Bracelet','MR'),
    molten_bracelet_ll: generate_equip_attribute('Molten Bracelet','LL'),
    molten_cloak: {'Molten Cloak': {'lore_entries':['Mana Regen', 'Mana Pool']}},
    molten_cloak_archer: {'Molten Cloak': {'lore_entries':['Lifeline', 'Mana Pool']}},
    molten_cloak_mp: generate_equip_attribute('Molten Cloak','MP'),
    molten_cloak_mr: generate_equip_attribute('Molten Cloak','MR'),
    molten_cloak_ll: generate_equip_attribute('Molten Cloak','LL'),
    molten_belt_archer: {'Molten Belt': {'lore_entries':['Lifeline', 'Mana Pool']}},
    molten_belt_mp: generate_equip_attribute('Molten Belt','MP'),
    blaze_belt_demon: {'Blaze Belt': {'lore_entries':['Veteran', 'Vitality ']}},
    blaze_belt_veteran: generate_equip_attribute('Blaze Belt','Vet'),
    blaze_belt_vitality: generate_equip_attribute('Blaze Belt','Vit'),

    attribute_blazing: generate_equip_attribute('Attribute Shard','BF'),
    attribute_fishing: generate_equip_attribute('Attribute Shard','FE'),
    attribute_mana_pool: generate_equip_attribute('Attribute Shard','MP'),
    attribute_mana_regen: generate_equip_attribute('Attribute Shard','MR'),
    attribute_lifeline: generate_equip_attribute('Attribute Shard','LL'),
    attribute_double_hook: generate_equip_attribute('Attribute Shard','Double Hook'),
    attribute_ignition_mana_steal: { attribute_sort: true,
        'Attribute Shard': { all_together: false,
            'lore_entries': ['Ignition', 'Mana St']}},
    useful_attrs: {
        'Attribute Shard': { all_together: false,
            'lore_entries': ['Mana Regen', 'Mana Pool', 'Blazing Fortune', 'Fishing Exp']}
    },
    vitality_armor: generate_armor_attributes(['vit'], true, 10000000),
    dominance_armor: generate_armor_attributes(['dom'], true, 10000000),
    veteran_armor: generate_armor_attributes(['vet'], true, 10000000),
    mana_pool_armor: generate_armor_attributes(['mp'], true, 10000000),
    mana_regen_armor: generate_armor_attributes(['mr'], true, 10000000),
    pet_mole_100: { '[Lvl 100] Mole': {}},
    pet_slug_100: { '[Lvl 100] Slug': { exact_tier: "LEGENDARY" }},
    pet_slug_leg: { '] Slug': { exact_tier: "LEGENDARY" }}
}

export async function auctionDownload() {
    const result = { pages: [] };
    let active = 0;
    let next = 0;

    async function task() {
        let page = next++;
        const start = Date.now();
        active++;
        const url = `https://api.hypixel.net/skyblock/auctions?page=${page}`;
        const response = await fetch(url);
        const answer = response.ok ? await response.json() : response;
        active--;
        result.pages.push({load_time: Date.now() - start, answer});
        return answer;
    }

    const start = Date.now();
    await new Promise((resolve, reject) => {
        let remain = 0;
        function start() {
            remain--;
            task().then(json => {
                if (remain < 0) {
                    remain += json['totalPages'];
                    console.log(`Loading auction, ${json['totalPages']} pages total...`);
                }
                if (remain > 0) {
                    start();
                }
                if (active === 0) {
                    resolve();
                }
            }).catch(reject);
        }
        for (let i = 0; i < 10; i++) {
            start();
        }
    });
    result.time_updated = Date.now();
    result.load_time = result.time_updated - start;
    console.log(`Pages loaded: ${result.pages.length}, Load time: ${result.load_time/1000} sec`);

    return result;
}

export function auctionFilter(data, filter) {
    const result = [];
    const counter = {};
    data.pages.forEach(page => {
        if (page.answer.success) {
            for (let item of page.answer['auctions']) {
                const item_name = item['item_name'];
                let conditions;
                for (let search_name in filter) {
                    if (item_name.includes(search_name)) {
                        conditions = filter[search_name];
                        break;
                    }
                }
                if (conditions === undefined) continue;
                let cnt = counter[item_name];
                if (cnt === undefined) {
                    cnt = {found: 0, passed: 0};
                    counter[item_name] = cnt;
                }
                cnt.found += 1;
                const maxPrice = conditions.max_price;
                const allTogether = conditions.all_together ?? true;
                const exactTier = conditions.exact_tier;
                let topBid = item['highest_bid_amount'];
                if (topBid === 0) topBid = item['starting_bid'];
                if (maxPrice !== undefined && topBid > maxPrice) continue;
                if (exactTier !== undefined && item.tier !== exactTier) continue;
                const entries = [];
                const lore_entries = conditions.lore_entries ?? [];
                const item_lore = item['item_lore'];
                for (let entry of lore_entries) {
                    const p = item_lore.indexOf(entry);
                    if (p >= 0) {
                        const end = item_lore.indexOf('\n', p);
                        entries.push(item_lore.slice(p, end));
                    }
                }
                if (allTogether && entries.length < lore_entries.length ||
                    lore_entries.length > 0 && entries.length === 0) continue;
                cnt.passed += 1;

                let price_one = 0;
                if (filter.attribute_sort === true && entries.length > 0) {
                    const attribute = entries[0];
                    const p = attribute.indexOf(' ', lore_entries[0].length - 1) + 1;
                    if (p > 0) {
                        let end = attribute.indexOf(' ', p);
                        if (end === -1) { end = attribute.length; }
                        const roman = attribute.slice(p, end);
                        const multiplier = roman_multipliers[roman] ?? 1;
                        price_one = topBid / multiplier;
                    }
                }

                item.lore_entries = entries;
                item.top_bid = topBid;
                item.price_one = price_one;
                result.push(item);
            }
        }
    });

    return {counter, attribute_sort: filter.attribute_sort, result};
}

export function analyzeData(data, filter) {
    const prices = {};

    data.pages.forEach(page => {
        if (page.answer.success) {
            for (let item of page.answer['auctions']) {
                const item_name = item['item_name'];
                for (let search_name in filter) {
                    if (item_name.includes(search_name)) {
                        const conditions = filter[search_name];
                        const maxPrice = conditions.max_price;
                        let topBid = item['highest_bid_amount'];
                        if (topBid === 0) topBid = item['starting_bid'];
                        if (maxPrice !== undefined && topBid > maxPrice) continue;
                        item.top_bid = topBid;
                        let price_item = prices[search_name];
                        if (price_item === undefined) {
                            price_item = { items: [] };
                            prices[search_name] = price_item;
                        }
                        price_item.items.push(item);
                        break;
                    }
                }
            }
        }
    });

    for (let price_item of Object.values(prices)) price_item.items.sort((a, b) => a.top_bid - b.top_bid);
    
    return prices;
}

export function calculatePrices(data, bazaar, filter) {
    function getSellPrice(code) {
        const product = bazaar.products[code];
        if (product === undefined) console.log(`Product ${code} not found`);
        return product === undefined? 0: product.sell_price;
    }

    const result = [];
    data.pages.forEach(page => {
        if (page.answer.success) {
            for (let item of page.answer['auctions']) {
                const item_name = item['item_name'];
                const item_lore = item['item_lore'];
                if (!item_name.includes(filter.item_name)) continue;

                const new_item = { item_name, bin: item.bin, price_entries: {'Raw item': filter.base_price}, item_lore};
                let topBid = item['highest_bid_amount'];
                if (topBid === 0) topBid = item['starting_bid'];
                new_item.top_bid = topBid;
                let ench_price = 0;
                // enchants with specific level
                for (let [ench, code] of Object.entries(enchants_exact))
                    if (item_lore.includes(ench)) {
                        const price = getSellPrice(code);
                        new_item.price_entries[ench] = price;
                        ench_price += price;
                    }
                // enchants counted from 1st level
                for (let [ench, code] of Object.entries(enchants_one))
                    if (item_lore.includes(ench)) {
                        let price = getSellPrice(code);
                        let p = item_lore.indexOf(ench);
                        const lore_part = item_lore.slice(p, item_lore.indexOf('§', p));
                        p = lore_part.indexOf(' ', ench.length - 1) + 1;
                        if (p > 0) {
                            let end = lore_part.indexOf('\n', p);
                            if (end === -1) { end = lore_part.length; }
                            const roman = lore_part.slice(p, end);
                            price *= roman_multipliers[roman] ?? 1;
                        }
                        new_item.price_entries[ench] = price;
                        ench_price += price;
                    }
                // stars
                const stars_count = item_name.split('✪').length - 1;
                const essence_price = getSellPrice(filter.essence.code);
                let star_price = essence_price * filter.essence.count[stars_count];
                // master stars
                let i = stars.symbols.length;
                while (i > 0 ) {
                    if (item_name.includes(stars.symbols[i-1])) break;
                    i--;
                }
                while (--i >= 0) {
                    const ms_star_price = getSellPrice(stars.names[i]);
                    new_item.price_entries[snakeToSpaced(stars.names[i])] = ms_star_price;
                    star_price += ms_star_price;
                }
                // abilities
                let scrolls_price = 0;
                for (let [ability, scrolls] of Object.entries(filter.abilities ?? {})) 
                    if (item_lore.includes('Ability: ' + ability)) {
                        for (let scroll of scrolls) {
                            const price = getSellPrice(scroll);
                            scrolls_price += price;
                            new_item.price_entries[snakeToSpaced(scroll)] = price;
                        }
                    }
                let other_price = 0;
                // recomb
                new_item.tier = item.tier;
                if (new_item.tier !== filter.base_tier) {
                    const rec_price = getSellPrice(recomb_item);
                    other_price += rec_price;
                    new_item.price_entries[snakeToSpaced(recomb_item)] = other_price;
                }

                new_item.star_price = round(star_price, 1);
                new_item.ench_price = round(ench_price, 1);
                new_item.scrolls_price = round(scrolls_price, 1);
                new_item.other_price = other_price;
                new_item.real_price = round(filter.base_price + ench_price + star_price + scrolls_price + other_price, 1);
                new_item.profit = round(new_item.real_price - topBid, 1);
                result.push(new_item);
            }
        }
    });
    
    result.sort((a, b) => b.profit - a.profit);

    return result;
}