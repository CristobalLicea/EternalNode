const mongoose = require('mongoose');

const DNCharacterSchema = new mongoose.Schema({
  name: {type: String},
  level: {type: Number},
  race: {type: String},
  class: {type: String},
  stats: {
    strength: {type: Number},
    dexterity: {type: Number},
    constitution: {type: Number},
    intelligence: {type: Number},
    wisdom: {type: Number},
    charisma: {type: Number},
    profBonus: {type: Number},
    walkSpeed: {type: Number},
    maxHP: {type: Number},
    HP: {type: Number},
    tempHP : {type: Number},
    initiative : {type: Number},
    inspiration : {type: Number},
    conditions : {type: Number},
    defenses: {type: Number},
    armor: {type: Number},
  },
  savingThrows: {
    strength: {type: Number},
    dexterity: {type: Number},
    constitution: {type: Number},
    intelligence: {type: Number},
    wisdom: {type: Number},
    charisma: {type: Number},
  },
  senses: [{
    sense: String, level: Number
  }],
  proficiencies: {
    armor: [{}],
    weapons: [{}],
    tools: [{}]
  },
  languages: [{language: String}],
  skills: [{
    skill: String, bonus: Number, mod: String, proficiency: Boolean
  }]

})

module.exports = mongoose.model('DNCharacter', DNCharacterSchema)