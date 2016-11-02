var rank_table = {
  init: function (){
    var finish_count = 2;
    var finish_default_count = 2;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', window.location.origin + '/load_rank_table/2016-10-07', true);
    xhr.addEventListener("load", function (e){
      var docs  = JSON.parse(xhr.responseText);
      this.cur_table = docs[0];
      finish_count--;
      if(finish_count <= 0){
        finish_count = finish_default_count;
        this.make_table();
      }
    }.bind(this));
    xhr.send();

    var xhr2 = new XMLHttpRequest();
    xhr2.open('GET', window.location.origin + '/load_rank_table', true);
    xhr2.addEventListener("load", function (e){
      var docs  = JSON.parse(xhr.responseText);
      this.old_table = docs[0];
      finish_count--;
      if(finish_count <= 0){
        finish_count = finish_default_count;
        this.make_table();
      }
    }.bind(this));
    xhr2.send();
  },
  cur_table : {},
  old_table : {},
  make_table : function (){
    var tbody = document.querySelector("table.rank_table tbody");
    console.log(this.cur_table);
    for(i in this.cur_table){
      var diz = this.cur_table[i];
      for( j in this.old_table){
        var old_diz = this.old_table[j];
        if(diz.dzNum == old_diz.dzNum){
          if(diz.ratio < old_diz.ratio * 0.98)
            diz.trend = 'down';
          else if (diz.ratio > old_diz.ratio * 1.02)
            diz.trend = 'up';
          else
            diz.trend = 'flat';
        }
        break;
      }
      var tr = document.createElement("TR");
      var listHTML =
        "<td class='mdl-data-table__cell--non-numeric'>"+ diz.dzName+"</td>" +
        "<td><span class='mdl-list__item-sub-title'>"+ Math.round(diz.ratio * 1000) / 10 +"%" +"</span></td>" +
        "<td class='icon_"+diz.trend+" icon'><i class='material-icons small-icon'>ic_trending_" +diz.trend+"</i></td>"
        ;
      tr.innerHTML = listHTML;
      tbody.appendChild(tr);
    }
  }
}

rank_table.init();
