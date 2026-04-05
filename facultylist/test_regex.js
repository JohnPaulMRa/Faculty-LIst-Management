import fs from 'fs';
const rawContent = fs.readFileSync('storage/app/temp_disciplines.json', 'utf-8');
const data = JSON.parse(rawContent);

const list = Array.isArray(data) ? data : data[0]; // because tinker wraps multiple queries or sometimes returns raw arrays

const bachelors = list.filter(d => /\bbachelor(s)?\b/i.test(d.description) || /\bab\b/i.test(d.description) || /\bbs\b/i.test(d.description) || /\bassociate\b/i.test(d.description) || /\b(?:certificate|cert)\b/i.test(d.description) || /\bdiploma\b/i.test(d.description) || /\bpre-/i.test(d.description) || String(d.code).startsWith('507'));
const masters = list.filter(d => /\bmaster(s)?\b/i.test(d.description) || /\bma\b/i.test(d.description) || /\bms\b/i.test(d.description) || /graduate certificate/i.test(d.description) || /\bprofessional\b/i.test(d.description) || String(d.code).startsWith('80'));
const doctorate = list.filter(d => /\bdoctor(?:ate)?\b/i.test(d.description) || /\bphd\b/i.test(d.description) || /post(?:\s|-)graduate/i.test(d.description) || String(d.code).startsWith('90'));
const primary = list.filter(d => !/\bbachelor(s)?\b/i.test(d.description) && !/\bmaster(s)?\b/i.test(d.description) && !/\bdoctor(?:ate)?\b/i.test(d.description) && !/\bphd\b/i.test(d.description) && !/\bab\b/i.test(d.description) && !/\bbs\b/i.test(d.description) && !/\bma\b/i.test(d.description) && !/\bms\b/i.test(d.description) && !/\bassociate\b/i.test(d.description) && !/post(?:\s|-)graduate/i.test(d.description) && !String(d.code).startsWith('507') && !String(d.code).startsWith('80') && !String(d.code).startsWith('90'));


console.log('--- Bachelors ---');
console.log(bachelors.map(x => x.description).slice(0, 10));

console.log('\n--- Masters ---');
console.log(masters.map(x => x.description).slice(0, 10));

console.log('\n--- Doctorate ---');
console.log(doctorate.map(x => x.description).slice(0, 10));

console.log('\n--- Primary ---');
console.log(primary.map(x => x.description).slice(0, 10));
