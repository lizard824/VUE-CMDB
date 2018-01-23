
//dialog drag module
export function move() {

  window.onload = function () {
    var dialog = document.querySelectorAll("div.el-dialog")

    dialog.onmousedown = function (ev) {
      var oevent = ev || event;

      var distanceX = oevent.clientX - dialog.offsetLeft;
      var distanceY = oevent.clientY - dialog.offsetTop;

      document.onmousemove = function (ev) {
        var oevent = ev || event;
        dialog.style.left = oevent.clientX - distanceX + 'px';
        dialog.style.top = oevent.clientY - distanceY + 'px';
      };
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };

    }
  }

}

