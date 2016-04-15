var ChannelUtil = module.exports;

var GLOBAL_CHANNEL_NAME = 'sparxo';
var STUDIO_CHANNEL_PREFIX = 'studio_';

ChannelUtil.getGlobalChannelName = function() {
  return GLOBAL_CHANNEL_NAME;
};

ChannelUtil.getStudioChannelName = function(studioId) {
  return STUDIO_CHANNEL_PREFIX + studioId;
};
