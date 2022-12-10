const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector(".crud-title"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment();



const getAll = async() => {
    try {
        let res = await fetch("http://localhost:3000/api/series"),
        json = await res.json();

        if(!res.ok) throw{ status: res.status, statusText: res.statusText };

        console.log(json);
        json.forEach(el => {
            $template.querySelector(".title").textContent = el.titulo;
            $template.querySelector(".gender").textContent = el.genero;
            $template.querySelector(".year").textContent = el.año;
            $template.querySelector(".score1").textContent = el.score;
            $template.querySelector(".edit").dataset.id = el.id;
            $template.querySelector(".edit").dataset.title = el.titulo;
            $template.querySelector(".edit").dataset.gender = el.genero;
            $template.querySelector(".edit").dataset.year = el.año;
            $template.querySelector(".edit").dataset.score1 = el.score;
            $template.querySelector(".delete").dataset.id = el.id;


            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
        });

        $table.querySelector("tbody").appendChild($fragment);

    } catch (err) {
       let message = err.statusText ||"Ocurrio un error";
       $table.insertAdjacentHTML("afterend",`<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async e => {
    if(e.target === $form){
      e.preventDefault();
      
      if(!e.target.id.value){
        //Create - POST
        try {
            let options = {
                method: "POST",
                headers:{
                    "Content-type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    titulo: e.target.titulo.value,
                    genero: e.target.genero.value,
                    año: e.target.año.value,
                    score: e.target.score.value
                })
            },
            res = await fetch("http://localhost:3000/api/series", options),
            json = await res.json();

            if(!res.ok) throw{ status: res.status, statusText: res.statusText }; 
            location.reload();

        } catch (error) {
            let message = err.statusText ||"Ocurrio un error";
            $form.insertAdjacentHTML("afterend",`<p><b>Error ${err.status}: ${message}</b></p>`);
        }
      }else{
        //Update - PUT
        try {
            let options = {
                method: "PUT",
                headers:{
                    "Content-type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    titulo: e.target.titulo.value,
                    genero: e.target.genero.value,
                    año: e.target.año.value,
                    score: e.target.score.value
                })
            },
            res = await fetch(`http://localhost:3000/api/series/${e.target.id.value}`, options),
            json = await res.json();

            if(!res.ok) throw{ status: res.status, statusText: res.statusText }; 
            location.reload();

        } catch (error) {
            let message = err.statusText ||"Ocurrio un error";
            $form.insertAdjacentHTML("afterend",`<p><b>Error ${err.status}: ${message}</b></p>`);
        }
      }
    }
});

d.addEventListener("click", async e => {
    if (e.target.matches(".edit")){
        $title.textContent = "Editar Serie";
        $form.titulo.value = e.target.dataset.title;
        $form.genero.value = e.target.dataset.gender;
        $form.año.value = e.target.dataset.year;
        $form.score.value = e.target.dataset.score1;
        $form.id.value = e.target.dataset.id;
    }

    if(e.target.matches(".delete")){
        let isDelete = confirm(`¿Esta seguro de eliminar el id ${e.target.dataset.id}?`);

        if(isDelete){
            //Delete - DELETE
            try {
                let options = {
                    method: "DELETE",
                    headers:{
                        "Content-type":"application/json; charset=utf-8"
                    },
                },
                res = await fetch(`http://localhost:3000/api/series/${e.target.dataset.id}`, options),
                json = await res.json();
    
                if(!res.ok) throw{ status: res.status, statusText: res.statusText }; 
                location.reload();
    
            } catch (error) {
                let message = err.statusText ||"Ocurrio un error";
                alert(`Error ${err.status}: ${message}`);
            } 
        }
    }
})