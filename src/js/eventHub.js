import Vue from "vue";

const eventHub = new Vue();

class CardEvent {

    constructor(object) {

        this.type = object.type;
        this.id = object.id;
    }
}

export {eventHub};
export {CardEvent};