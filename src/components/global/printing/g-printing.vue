<template>
  <div class="g-printing-body">
    <iframe id="printIframe" name="printIframe"></iframe>
    <div id="printingBody">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const methods = {
  printing() {
    //获得id里的内容
    var printHtml = document.getElementById("printingBody").innerHTML;
    //将iframe标签里的body结构换成需要打印的内容
    document.getElementById("printIframe").contentDocument.body.innerHTML = printHtml;
    document.getElementById("printIframe").contentDocument.body.style.margin = "0";
    //调用iframe这个子窗口的打印方法
    window.frames["printIframe"].print();
  },
};

defineExpose({
  printing: methods.printing,
});
</script>
