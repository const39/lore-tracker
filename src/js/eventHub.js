import Vue from "vue";

export const eventHub = new Vue();

export class CardEvent {
    constructor(type, object) {
        this.type = type;
        this.object = object;
    }
}

export class TagEvent {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }
}