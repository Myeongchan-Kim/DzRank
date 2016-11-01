var rank_table = {
  init: function (){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', window.location.origin + '/load_rank_table', true);
    xhr.addEventListener("load", function (e){
      var docs  = JSON.parse(xhr.responseText);
      this.cur_table = docs[0];
      finish_count--;
      if(finish_count <= 0){
        this.make_table();
      }
    });
    xhr.send();

    var xhr2 = new XMLHttpRequest();
    xhr2.open('GET', window.location.origin + '/load_rank_table', true);
    xhr2.addEventListener("load", function (e){
      var docs  = JSON.parse(xhr.responseText);
      this.old_table = docs[0];
      finish_count--;
      if(finish_count <= 0){
        this.make_table();
      }
    });
    xhr2.send();
  },
  finish_count : 2,
  cur_table : {},
  old_table : {},
  make_table : function (cur_docs, old_docs){
    var tbody = document.querySelector("table.rank_table tbody");
    for(i in dizList){
      var diz = dizList[i];
      console.log(diz);
      var tr = document.createElement("TR");
      var listHTML =
        "<td class='mdl-data-table__cell--non-numeric'>"+ diz.dzName+"</td>" +
        "<td><span class='mdl-list__item-sub-title'>"+ Math.round(diz.ratio * 1000) / 10 +"%" +"</span></td>" +
        "<td class='icon_down icon'><i class='material-icons small-icon'>ic_trending_down</i></td>"
        ;
      tr.innerHTML = listHTML;
      tbody.appendChild(tr);
    }
  }
}

rank_table.init();
