$(async function () {
    await getUsers();
    await tittle();
    await getUser();
    await infoUser();
    await createNewUserForm();
    await createNewUser();
    await getDefaultModal();
})

let roleList = [
    {id: 1, role: "ROLE_ADMIN"},
    {id: 2, role: "ROLE_USER"}

]
let isUser = true;

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },

    findAllUsers: async () => await fetch('api/admin/adminpanels'),
    findOneUser: async (id) => await fetch(`api/admin/adminpanels/${id}`),
    addNewUser: async (user) => await fetch('api/admin/adminpanels', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    updateUser: async (user, id) => await fetch(`api/admin/adminpanels/${id}`, {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/admin/adminpanels/${id}`, {method: 'DELETE', headers: userFetchService.head}),
    findUserByUsername: async () => await fetch(`api/admin/adminpanel`)

}

async function infoUser() {
    let temp = '';
    const info = document.querySelector('#info');
    await userFetchService.findUserByUsername()

        .then(res => res.json())
        .then(user => {
            temp += `
             <span style="color: white">
               ${user.username} with roles <span>${user.roles.map(e => " " + e.name.substr(5))}</span>
                </div>
            </span>
                </tr>
            `;
        });
    info.innerHTML = temp;
}



async function tittle() {
    let temp = ''
    const h1a1 = document.querySelector('#h1a1');
    if (isUser) {
        temp = `
            <h1 className="h1 a1" id="h1a1">User information page</h1>
            `;
        h1a1.innerHTML = temp;
    } else {
        temp = `
            <h1 className="h1 a1" id="h1a1">Admin panel</h1>
            `;
        h1a1.innerHTML = temp;
    }
}



//table functions
async function getUsers() {

    let temp = '';
    const table = document.querySelector('#tableAllUsers tbody');

    if (table != null) {
    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                temp += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.surname}</td>
                    <td>${user.age}</td>  
                    <td>${user.username}</td>
                    <td>${user.roles.map(r => " " + r.name.substr(5))}</td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info"
                            className data-toggle="modal" data-target="#editModal">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger"
                            className data-toggle="modal" data-target="#deleteModal">Delete</button>
                    </td>
                </tr>
               `;
            })
            table.innerHTML = temp;

        })

    $("#tableAllUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}
}

async function getUser() {
    let temp = '';
    const table = document.querySelector('#tableUser tbody');
    await userFetchService.findUserByUsername()
        .then(res => res.json())
        .then(user => {
            temp = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.name}</td>
                    <td>${user.surname}</td>
                    <td>${user.age}</td>
                    <td>${user.roles.map(e => " " + e.name.substr(5))}</td>
                </tr>
            `;
            table.innerHTML = temp;

            $(function (){
                let role = ""
                for (let i = 0; i < user.roles.length; i++) {
                    role = user.roles[i].name
                    if (role === "ROLE_ADMIN") {
                        isUser = false;
                    }
                }
                if (isUser) {
                    $("#userTable").addClass("show active");
                    $("#userTab").addClass("show active");
                } else {
                    $("#tabUsersTable").addClass("show active");
                    $("#adminTab").addClass("show active");
                }
            })
        })
}

// new user code
async function createNewUserForm() {
    let button = $(`#addUser`);
    let form = $(`#newUserForm`)
    button.on('click', () => {
        form.show()
    })
}


async function createNewUser() {
    $('#addUser').on('click', async () =>  {
        let addUserForm = $('#newUserForm')
        let name = addUserForm.find('#nameCreate').val().trim();
        let surname = addUserForm.find('#surnameCreate').val().trim();
        let age = addUserForm.find('#ageCreate').val().trim();
        let username = addUserForm.find('#usernameCreate').val().trim();
        let password = addUserForm.find('#passwordCreate').val().trim();

        let checkedRoles = () => {
            let array = []
            let options = document.querySelector('#rolesCreate').options
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    array.push(roleList[i])
                }
            }
            return array;
        }

        let data = {
            username: username,
            password: password,
            name: name,
            surname: surname,
            age: age,
            roles: checkedRoles()
        }



        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            await getUsers();
            $('.nav-tabs a[href="#adminTable"]').tab('show');
        }
    })


}



async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);

        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

// редактируем юзера из модалки редактирования, забираем данные, отправляем
async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button type="submit" class="btn btn-info" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form align="center"  class="form-group text-center" class="offset-md-4 col-md-3 mt-4 mb-5 " id="editUser">
               <div class="form-group">
                    <label for="id" class="col-form-label">ID</label>
                    <input type="text" class="form-control username" id="id" value="${user.id}" readonly>
               </div>
                   
               <div class="form-group">
                    <label for="username" class="col-form-label">Username</label>
                    <input type="text" class="form-control username" id="username" value="${user.username}" required>
               </div>
                <div class="form-group">
                    <label for="password" class="com-form-label">Password</label>
                    <input type="password" class="form-control" id="password" value="${user.password}" required>
                </div>
                <div class="form-group">
                    <label for="name" class="com-form-label">Name</label>
                    <input type="text" class="form-control" id="name" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="surname" class="com-form-label">Surname</label>
                    <input type="text" class="form-control" id="surname" value="${user.surname}" required>
                </div>
                <div class="form-group">
                    <label for="age" class="com-form-label">Age</label>
                    <input type="number" class="form-control" id="age" value="${user.age}" required>
                </div>                
                
                <div class="form-group">
                    <label for="roles" class="com-form-label">Role</label>
                    <select multiple id="roles" size="2" class="form-control" style="max-height: 100px" required >                
                    
                    <option value="ROLE_ADMIN">ADMIN</option>                    
                    <option value="ROLE_USER">USER</option>
                    </select>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let checkedRoles = () => {
            let array = []
            let options = document.querySelector('#roles').options
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    array.push(roleList[i])
                }
            }
            return array;
        }


        let id = modal.find("#id").val().trim();
        let username = modal.find("#username").val().trim();
        let password = modal.find("#password").val().trim();
        let name = modal.find("#name").val().trim();
        let surname = modal.find("#surname").val().trim();
        let age = modal.find("#age").val().trim();
        let data = {
            id: id,
            username: username,
            password: password,
            name: name,
            surname: surname,
            age: age,
            roles: checkedRoles()

        }


        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            await getUsers();
            modal.modal('hide');
        }
    })
}





//delete functions
async function deleteUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('delete');
    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);

    user.then(user =>
    {let bodyForm = `
            <form class="form-group text-center"  id="deleteUser">
               <div class="form-group">
                    <label for="id" class="col-form-label">ID</label>
                    <input type="text" class="form-control username" id="id" value="${user.id}" readonly>
               </div>
                   
               <div class="form-group">
                    <label for="username" class="col-form-label">Username</label>
                    <input type="text" class="form-control username" id="username" value="${user.username}" readonly>
               </div>
                <div class="form-group">
                    <label for="name" class="com-form-label">Name</label>
                    <input type="text" class="form-control" id="name" value="${user.name}" readonly>
                </div>
                <div class="form-group">
                    <label for="surname" class="com-form-label">Surname</label>
                    <input type="text" class="form-control" id="surname" value="${user.surname}" readonly>
                </div>
                <div class="form-group">
                    <label for="age" class="com-form-label">Age</label>
                    <input type="number" class="form-control" id="age" value="${user.age}" readonly>
                    <div class="invalid-feedback">
                        Age cannot be empty
                    </div>
                </div>               
                
                <div class="form-group">
                <label for="roles" class="com-form-label">Role:</label>
                <select id="roles" class="form-control select" size="2" name="roles" style="max-height: 100px" disabled>
                <option>${user.roles.map(role => role.name)}</option>            
                </select>                
            </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $('#deleteButton').on('click', async () => {
        const response = await userFetchService.deleteUser(id);

        if (response.ok) {
            await getUsers();
            modal.modal('hide');
        }
    })


}