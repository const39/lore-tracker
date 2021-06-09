export default {
    completed: 'mdi-check-decagram',
    player: 'mdi-account',
    npc: 'mdi-controller-classic',
    location: 'mdi-home',
    combat: 'mdi-sword-cross',
    encounter: 'mdi-account-group',
    discovery: 'mdi-magnify',
    travel: 'mdi-horseshoe',
    other: 'mdi-help',

    whichEventIcon: function (eventType) {
        switch (eventType.toLowerCase()) {
            case 'combat':
                return this.combat;
            case 'encounter':
                return this.encounter;
            case 'discovery':
                return this.discovery;
            case 'travel':
                return this.travel;
            default:
                return this.other;
        }
    }
}