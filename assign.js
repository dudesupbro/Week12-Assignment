
class Dog{
    constructor(name){
        this.name = name;
        this.master = [];
    }

    addMaster(name,phoneNumber){
        this.masters.push(new Master(name,phoneNumber));
    }
}

class Master{
    constructor(name,phoneNumber){
        this.name = name;
        this.phoneNumber = phoneNumber;
    }
}

class DogService {
    static url = 'https://crudcrud.com/api/1cc22a9118db4c2c9986070dd94130aa/dogs';
    
    static dogs;

    static getAllDogs(){
        return $.get(this.url);
    }
    static getDog(id){
        return  $.get(this.url + `/${id}`);
    }
    static createDog(dog){
        return $.ajax({
            url: this.url,
            type: "POST",
            data: JSON.stringify(dog),
            contentType: 'application/json',
            dataType: 'json'
        });
    }
    static updateDog(dog) {
        return $.ajax({
            url: this.url +`/${dog._id}`,
            dataType: 'json',
            data: JSON.stringify(dog),
            contentType: 'application/json',
            type: 'PUT'         
        });
    }
    static deleteDog(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type:'DELETE'
        });
    }
}

class DOMManager {
    static dogs;

    static getAllDogs() {
        DogService.getAllDogs().then(dogs => this.render(dogs));
    }

    static createDog(name) { 
        DogService.createDog(new Dog(name))
        .then(() => {
            return DogService.getAllDogs();
        })
        .then((dog) => this.render(dogs));
    }

    static deleteDog(id){
        DogService.deleteDog(id)
            .then(() =>{
                return DogService.getAllDogs();
            })
            .then((dogs) => this.render(dogs));
    }

    static addMaster(id) { 
        for (let dog of this.dogs){
            if (dog._id == id){
                dog.masters.push(new Master($(`#${dog._id}-master-name`).val(),$(`#${dog._id}-master-phoneNumber`).val()))
                DogService.updateDog(dog) 
                    .then(() => {
                        return DogService.getAllDogs();
                    })
                    .then((dogs) => this.render(dogs));
            }
        }
    }
    
    static deleteMaster(dogId,masterId){
        for (let dog of this.dogs){
           if (dog._id == dogId) {
            for (let master of dog.masters) {
                dog.masters.splice(dog.masters.indexOf(master),1);
                DogService.updateDog(dog)
                .then(() =>{
                   return DogService.getAllDogs();
                })
                .then((dogs) => this.render(dogs))
            }
           }
        }
    }

    static render(dogs){
        $('#app').empty();
        for (let dog of dogs) {
            $('#app').prepend(
                `<div id="${dog._id}" class="card">
                    <div class"card-header">
                        <h2>${dog.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteDog('${dog._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card"
                            <div class="row":>
                                <div class="col_sm">
                                    <input type="text" id="${dog._id}-master-name" class ="form-control" placeholder="master Name">
                                </div>
                                <div class="col_sm">
                                    <input type="text" id="${dog._id}-master-phoneNumber" class ="form-control" placeholder="master phoneNumber">
                                </div>
                            </div>
                            <button id="${dog._id}-new-master" onclick="DOMManager.addMaster('${dog._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            if (dog.masters != undefined) {
                for (let master of dog.masters) {
                    $(`#${dog._id}`).find('.card-body').append(
                        `<p>
                        <span id="name-${master._id}"><strong>name: </strong> ${master.name}</span>
                        <span id="phoneNumber-${master._id}"><strong>phone number: </strong> ${master.phoneNumber}</span>
                        <button class="btn btn-dark" onclick="DOMManager.deletemaster('${dog._id}', '${master._id}')">Delete master</button></p>`
                    );
                }
            }
        }
    }
}

$('#create-new-dog').click(() =>{ 
    DOMManager.createDog($('#new-dog-name').val());
    $('#new-dog-name').val('');
});



DOMManager.getAllDogs();