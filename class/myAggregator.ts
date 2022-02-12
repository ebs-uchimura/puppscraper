/**
 * myAggregator.ts
 *
 * class：Aggregate
 * function：aggregate to csv file
 **/

"use strict";

// modules
import XLSX from 'xlsx'; // xlsx
     
export class Aggregate {

    static wb: XLSX.WorkBook;

    // constractor
    constructor() {
    }

    // initialize
    init(bookPath: string):Promise<void> {
        return new Promise(resolve => { 
            try { 
                // set worksheet
                Aggregate.wb = XLSX.readFile(bookPath);
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

    // write data
    writeData(titleArray: string[][], twoDimArray: string[][], sheetName: string):Promise<void> {
        return new Promise(resolve => {  
            try { 
                // set worksheet
                const outWs: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(titleArray);
                // add title
                XLSX.utils.book_append_sheet(Aggregate.wb, outWs, sheetName);
                // add data
                XLSX.utils.sheet_add_aoa(outWs, twoDimArray,{ origin: { r: 1, c: 0 } });
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

    // make csv file
    makeCsv(bookPath: string):Promise<void> {
        return new Promise(async(resolve) => {  
            try { 
                // write file
                XLSX.writeFile(Aggregate.wb, bookPath);
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

}