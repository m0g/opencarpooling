//userSchema = new SimpleSchema({
//  username: {
//      type: String,
//      //regEx: /^[a-z0-9A-Z_]{3,15}$/,
//      optional: true
//  },
//  emails: {
//      type: [Object],
//      // this must be optional if you also use other login services like facebook,
//      // but if you use only accounts-password, then it can be required
//      optional: true
//  },
//  "emails.$.address": {
//      type: String,
//      regEx: SimpleSchema.RegEx.Email,
//      optional: true
//  },
//  "emails.$.verified": {
//      type: Boolean,
//      optional: true
//  },
//  createdAt: {
//      type: Date,
//      optional: true
//  },
//  profile: {
//      type: Object,
//      optional: true
//  },
//  services: {
//      type: Object,
//      optional: true,
//      blackbox: true
//  },
//  roles: {
//      type: Object,
//      optional: true,
//      blackbox: true
//  }
//});

//Meteor.users.attachSchema(userSchema);
