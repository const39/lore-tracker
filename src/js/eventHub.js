import Vue from "vue";

export const eventHub = new Vue();

export class CardEvent {
    constructor(object) {
        this.object = object;
    }
}

export class TagEvent {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }
}