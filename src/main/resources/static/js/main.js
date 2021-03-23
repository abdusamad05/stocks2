function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}


var messageApi = Vue.resource('/message{/id}');

Vue.component('message-form', {
    props: ['messages', 'messageAttr'],
    data: function() {
        return {
            price:'',
            date: '',
            text: '',
            id: ''
        }
    },
    watch: {
        messageAttr: function(newVal, oldVal) {
            this.price = newVal.price;
            this.date = newVal.date;
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
        '<div>' +
        '<input type="date"  class="form-control" v-model="date" />' +
        '<input type="text" class="form-control" placeholder="Введите текст" v-model="text" />' +
        '<input type="number" class="form-control" placeholder="Введите цену" v-model="price" />' +
        '<input type="button" class="btn btn-primary" value="Save" @click="save" />' +
        '</div>',
    methods: {
        save: function() {
            var message = { text: this.text,

                price: this.price, date: this.date};

            if (this.id) {
                messageApi.update({id: this.id}, message).then(result =>
                result.json().then(data => {
                    var index = getIndex(this.messages, this.price, this.date, data.id);
                this.messages.splice(index, 1, data);
                this.price = ''
                this.date = ''
                this.text = ''
                this.id = ''
            })
            )
            } else {
                messageApi.save({}, message).then(result =>
                result.json().then(data => {
                    this.messages.push(data);
                this.text = ''
                this.price = ''
                this.date = ''
            })
            )
            }
        }
    }
});

Vue.component('message-row', {
    props: ['message', 'editMethod', 'messages'],
    template: '<div>' +

       '<table border="1" width="100%" cellpadding="5">'+

        '<tr>'+
        '<th width="20%">Дата</th>'+
        '<th width="20%">Акции</th>'+
        '<th width="20%">Стоимость</th>'+
        '<th width="20%">Редактировать</th>'+
        '<th width="20%">Удалить</th>'+
        '</tr>'+



        '<tr>'+
        '<td width="20%">{{ message.text }}</td>' +
        '<td width="20%">{{ message.date }}</td> ' +
        '<td width="20%">{{ message.price }}</td>' +
        '<td width="20%"><input type="button" class="btn btn-primary" value="Изменить" @click="edit" /></td>' +
        '<td width="20%"><input type="button" class="btn btn-primary" value="X" @click="del" /></td>' +
        '</tr>'+
        '</table>'+
        '</div>',
    methods: {
        edit: function() {
            this.editMethod(this.message);
        },
        del: function() {
            messageApi.remove({id: this.message.id}).then(result => {
                if (result.ok) {
                this.messages.splice(this.messages.indexOf(this.message), 1)
            }
        })
        }
    }
});

Vue.component('messages-list', {
    props: ['messages'],
    data: function() {
        return {
            message: null
        }
    },
    template:
        '<div style="position: relative; width: 300px;">' +
        '<message-form :messages="messages" :messageAttr="message" />' +
        '<message-row v-for="message in messages" :key="message.id" :message="message" ' +
        ':editMethod="editMethod" :messages="messages" />' +
        '</div>',
    created: function() {
        messageApi.get().then(result =>
        result.json().then(data =>
        data.forEach(message => this.messages.push(message))
    )
    )
    },
    methods: {
        editMethod: function(message) {
            this.message = message;
        }
    }
});

var app = new Vue({
    el: '#app',
    template: '<messages-list :messages="messages" />',
    data: {
        messages: []
    }
});