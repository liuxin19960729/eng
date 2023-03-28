const excelcovert = require('excel-convert');
const fs = require("fs");


/**去除表格空数据 */
function trimArray(array) {
    let newArray = [];
    let minLen = Infinity;
    for (let arr of array) {
        if (arr != null) {
            let isAllNull = true;
            for (let item of arr) {
                if (item != null) {
                    isAllNull = false;
                    break;
                }
            }
            if (isAllNull) {
                continue;
            }
            newArray.push(arr);
            if (arr.length < minLen) {
                minLen = arr.length;
            }
        }
    }
    for (let i = 0; i < minLen; i++) {
        let need = true;
        for (let arr of newArray) {
            if (arr[0] != null) {
                need = false;
            }
        }
        if (need) {
            for (let arr of newArray) {
                arr.shift();
            }
        } else {
            break;
        }
    }
    return newArray;
};

/**转换excel的key */
function formatKey(key) {
    let keyArray = key.split('');

    let yindex = 0;

    let mul = 1;
    while (!isNaN(parseInt(keyArray[keyArray.length - 1]))) {
        let num = parseInt(keyArray.pop());
        yindex = yindex + num * mul;
        mul *= 10;
    }

    let keyNum = 0;
    let len = keyArray.length;

    for (let i = 0; i < len; i++) {
        let str = keyArray[i];
        let num = str.charCodeAt(0);
        if (num >= 65 && num <= 90) {
            num -= 64;
        }
        let value = Math.pow(26, len - 1 - i) * num;
        keyNum += value;
    }

    return [keyNum, yindex];
};

/**将excel表对象转换为数据组 */
function objectToArray(obj) {
    let arr = [];
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        if (key.toString() == '!ref' || key.toString() == '!margins') {
            continue;
        }

        let indexArray = formatKey(key);
        if (arr[indexArray[1]] == null) {
            arr[indexArray[1]] = [];
        }
        arr[indexArray[1]][indexArray[0]] = obj[key].w;
    }
    return arr;
}




function buildDeclareTs(buffer) {
    let workbook = excelcovert.XLSX.read(buffer, { type: 'array' });
    let sheetNameArray = workbook.SheetNames;// 表名
    let sheets = workbook.Sheets;// 每个表的数据
    let dts = []
    for (let name of sheetNameArray) {
        let sheetObj = sheets[name];
        let sheetArray = objectToArray(sheetObj);
        if (sheetArray.length == 0) {
            continue;
        }
        sheetArray = trimArray(sheetArray);

        convertToDeclateTs(dts, sheetArray, name);
    }
    return dts;
}



/**解析为Json对象 */
function convertToDeclateTs(dts, sheetArray, sheetName) {
    let keyInfoArray = [];
    let typeInfoArray = [];
    let dataInfoArray = [];
    let commentInfoArray = [];
    for (let strArray of sheetArray) {
        if (strArray == null || strArray.length == 0) {
            continue;
        }
        let head = strArray[0];
        switch (head) {
            case '$k':
                keyInfoArray = strArray;
                break;
            case '$t':
                typeInfoArray = strArray;
                break;
            case '//':
                commentInfoArray = strArray;
                break;
            case '@':
                break;
            case '@T':
                break;
            case '$d':
            default:
                break;
        }
    }




    let table = new Table();
    table.tableName = sheetName;
    keyInfoArray.forEach((key, i) => {
        if (!!key && key != "" && key != "$k") {
            const keyobj = new Key()
            keyobj.comment = commentInfoArray.length > i && !!commentInfoArray[i] && commentInfoArray[i] != "" ? commentInfoArray[i] : null;
            keyobj.type = typeInfoArray[i];
            keyobj.key = key;
            table.keys.push(keyobj)
        }
    })

    dts.push(table)
};



class Table {
    tableName;
    keys = []
}

class Key {
    comment;
    type;
    key;
}

const outDir = "./assets/resources/data/";
const excelPath = "./buildExcel/excel/config.xlsx";


function main() {
    const buffer = fs.readFileSync(excelPath);
    excelcovert.setCustomConvert()
    let jsonData = excelcovert.convert(new Uint8Array(buffer));
    const dts = buildDeclareTs(new Uint8Array(buffer));

    dts.forEach(table => {
        const tableName = table.tableName;
        let content = "declare namespace dt{\n"
        content += `    interface ${tableName} {\n`
        const keys = table.keys;
        keys.forEach(key => {
            if (!!key.comment) {
                content += `    //${key.comment}\n`
            }
            content += `    readonly ${key.key}:${key.type}\n`
        })
        content += "}\n";
        content += "}";

        fs.writeFileSync(outDir + tableName + ".d.ts", content);
        fs.writeFileSync(outDir + tableName + ".json", JSON.stringify(jsonData[tableName]));
    })

    console.log("完成")

}

main();



