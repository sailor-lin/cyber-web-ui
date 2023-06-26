import { saveAsBlob } from './index.js';

class Excel {
  constructor() {}
  // getExcelTitle: 获取指定sheet表格头，仅限表格第一行
  getExcelTitle(sheet) {
    let flag = true
    let list = []
    let activeKey = 1
    while(flag) {
      let colName = this.numberToColumnName(activeKey) + "1";
      if (sheet[colName]) {
        list.push(sheet[colName]);
        activeKey++;
      } else {
        flag = false
      }
    }
    return list
  }
  // columnNameToNumber: 将excel表格列名转化为数字
  columnNameToNumber(columnName) {
    if(!columnName) return
    let list = columnName.split('').reverse();
    return list.reduce((pre, cur, index) => {
      let num = cur.codePointAt() - 64;
      if(index > 0) {
        return pre + Math.pow(26, num);
      } else {
        return pre + num;
      }
    }, 0)
  }
  // numberToColumnName: 将数字转化为excel表格列名
  numberToColumnName(num) {
    if(num == 0) return
    const codeA = 64;
    if (num <= 26) {
      return String.fromCharCode(codeA + num);
    }
    let columnName = "";
    let multiple = parseInt(num / 26);
    let remainder = num % 26;
  
    do {
      if (multiple > 26) {
        columnName += String.fromCharCode(65);
        multiple = multiple / 26;
      } else {
        columnName += String.fromCharCode(codeA + multiple);
        multiple = 0
        if (remainder > 0) {
          columnName += String.fromCharCode(codeA + remainder);
        } else {
          columnName += String.fromCharCode(codeA + 26);
        }
      }
    } while (multiple > 0);
    
    return columnName;
  }
  // initImportExcel：读取导入表格数据
  initImportExcel(file) {
    return new Promise((resolve, reject) => {
      let time = new Date().getTime();
      var reader = new FileReader();
      var name = file.name;
      var rABS = false;
      reader.onload = (e) => {
        var data = e.target.result;
        var wb;
        if (rABS) {
          wb = XLSX.read(data, {
            type: "binary",
          });
        } else {
          var arr = fixdata(data);
          wb = XLSX.read(btoa(arr), {
            type: "base64",
          });
        }
        // console.log("wb", wb, XLSX);
        //outdata是从excel中读取的数据，此处为Array数组类型
        //注：读取的数据以行为单位，每一行作为一个JS对象，也就是作为Array数组的一个元素，其中，每一行的每一列都是一个属性值(value)，对象的首个键(key)为表格第一行第一列的内容，往后依次为__EMPTY,__EMPTY_1,__EMPTY_2.....

        var excelList = wb.SheetNames.map((sheetName) => {
          return {
            title: getExcelTitle(wb.Sheets[sheetName]),
            data: XLSX.utils.sheet_to_json(wb.Sheets[sheetName]),
          };
        }).filter((item) => item.title.length > 0);

        resolve(excelList);
        // console.log(outdata, (new Date().getTime() - time) / 1000);
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    });
  }
  fixdata(data) {
    var o = "",
      l = 0,
      w = 10240;
    for (; l < data.byteLength / w; ++l)
      o += String.fromCharCode.apply(
        null,
        new Uint8Array(data.slice(l * w, l * w + w))
      );
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
  }
  /*
   * jsonToExcelFile: 将json对象数据转为可上传的excel文件(File格式)
   * 参数： data：[{ a: '', b: '' }]
   *        fileName: 文件名
   */
  async jsonToExcelFile(data = [], fileName = "excel") {
    const blob = this.jsonToBlob(data);
    // 将blob格式转为文件
    let file = await new window.File([blob], `${fileName}.xlsx`, {
      type: "application/vnd.ms-excel",
    });
    // 通过FormData转成上传文件格式
    // let formData = new FormData();
    // formData.append("file", file);
    return file;
  }
  // dataToBlob：将数据转换为支持转化为blob的数据
  dataToBlob = (s) => {
    //如果存在ArrayBuffer对象(es6) 最好采用该对象
    if (typeof ArrayBuffer !== "undefined") {
      //1、创建一个字节长度为s.length的内存区域
      var buf = new ArrayBuffer(s.length);
  
      //2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
      var view = new Uint8Array(buf);
  
      //3、返回指定位置的字符的Unicode编码
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    } else {
      var buf = new Array(s.length);
      for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }
  }
  /*
   * jsonToExcelFile: 将json对象数据转为blob格式
   * @data: [{ a: '', b: '' }]
   */
  jsonToBlob(data = []) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
    // 下载文件
    // XLSX.writeFile(wb, "下载.xlsx");
    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    });
    return new Blob([this.dataToBlob(wbout)], {
      type: "application/octet-stream",
    });
  }
  /*
   * download: 将excel的json对象数据下载到本地
   * @data: [{ a: '', b: '' }]
   * @fileName: 文件名称
   */
  download(data = [], fileName = '下载.xlsx') {
    let bloa = jsonToBlob(data);
    saveAsBlob(bloa, fileName);
  }
}

export default Excel;