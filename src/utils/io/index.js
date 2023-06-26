export const excelAccept = ".xls,.xlsx,.xlsm,.xlsb,.xla,.xlw,.csv";

/**
 * @function downloadDataFlow：下载接口返回的数据流
 * @param {array} data 要下载的数据流
 * @param {string} fileName 导出文件名
 * @returns {promise}
 */
export const downloadDataFlow = (data, fileName) => {
  return new Promise((resolve, reject) => {
    if (!data) {
      message.warning("文件下载失败");
      reject();
      return;
    }
    let acceptList = excelAccept.split(',')
    let obj = {}
    if(acceptList.some(item => fileName.includes(item))) {
      obj.type = "application/vnd.ms-excel";
    }
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(
        new Blob([data], obj),
        fileName
      );
    } else {
      let url = window.URL.createObjectURL(new Blob([data], obj));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
    resolve();
  });
}

/** 
 * @function saveAsBlob：下载blob文件
 * @param {blob} blob 下载的文件
 * @param {string} fileName 下载的文件名
 */
export const saveAsBlob = (blob, fileName = "下载.txt") => {
  //当然可以自定义简单的下载文件实现方式
  let link = document.createElement("a");
  link.download = fileName;
  link.href = URL.createObjectURL(blob); //绑定a标签
  link.click(); //模拟点击实现下载

  setTimeout(function () {
    //延时释放
    URL.revokeObjectURL(blob); //用URL.revokeObjectURL()来释放这个object URL
  }, 100);
}

//根据文件后缀 获取base64前缀不同
// export const getBase64Type = (type) => {
//   switch (type) {
//     case 'txt': return 'data:text/plain;base64,';
//     case 'doc': return 'data:application/msword;base64,';
//     case 'docx': return 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,';
//     case 'xls': return 'data:application/vnd.ms-excel;base64,';
//     case 'xlsx': return 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
//     case 'pdf': return 'data:application/pdf;base64,';
//     case 'pptx': return 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,';
//     case 'ppt': return 'data:application/vnd.ms-powerpoint;base64,';
//     case 'png': return 'data:image/png;base64,';
//     case 'jpg': return 'data:image/jpeg;base64,';
//     case 'gif': return 'data:image/gif;base64,';
//     case 'svg': return 'data:image/svg+xml;base64,';
//     case 'ico': return 'data:image/x-icon;base64,';
//     case 'bmp': return 'data:image/bmp;base64,';
//   }
// }