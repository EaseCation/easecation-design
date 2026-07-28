import fs from 'node:fs/promises';
import Ajv from 'ajv';
const schema=JSON.parse(await fs.readFile(new URL('../registry/component.schema.json',import.meta.url),'utf8'));
const registry=JSON.parse(await fs.readFile(new URL('../registry/components.json',import.meta.url),'utf8'));
const ajv=new Ajv({allErrors:true});const validate=ajv.compile(schema);
if(!validate(registry)){console.error(validate.errors);process.exit(1)}
const names=registry.components.map(component=>component.name);if(new Set(names).size!==names.length){console.error('Registry contains duplicate component names.');process.exit(1)}
console.log(`Registry valid: ${names.length} components.`);