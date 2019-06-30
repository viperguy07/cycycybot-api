const graphql = require('graphql');
const mongoose = require('mongoose');
const Mod = require('../../models/modDBtest');

const {
  GraphQLString,
  GraphQLNonNull,
} = graphql;

// mod type
const { ModType } = require('../types/modType');

const addmod = {
  type: ModType,
  args: {
    id: { type: GraphQLString },
    serverID: { type: new GraphQLNonNull(GraphQLString) },
    serverName: { type: new GraphQLNonNull(GraphQLString) },
    modName: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    const mod = new Mod({
      _id: mongoose.Types.ObjectId(),
      serverID: args.serverID,
      serverName: args.serverName,
      modName: args.modName,
    });

    return Mod.find({ serverID: args.serverID }).then((res) => {
      if (res.length >= 1) {
        return 'already added';
      }
      return mod.save();
    });
  },
};

const delmod = {
  type: ModType,
  args: {
    id: { type: GraphQLString },
    serverID: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    return Mod.deleteOne({ serverID: args.serverID });
  },
};

module.exports = {
  addmod,
  delmod,
};
