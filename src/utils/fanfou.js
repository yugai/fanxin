import Fanfou from 'fanfou-sdk-browser';
import {consumerKey, consumerSecret} from './fanfoukey';

const apiDomain = 'cors.fanfou.com';
const oauthDomain = 'cors.fanfou.com';
const hooks = {
    baseString: baseStr => {
        return baseStr
            .replace('%2F%2Fcors.fanfou.com%2Foauth', 'http%3A%2F%2Ffanfou.com%2Foauth')
            .replace('%2F%2Fcors.fanfou.com', 'http%3A%2F%2Fapi.fanfou.com');
    }
};
const opt = {consumerKey, consumerSecret, apiDomain, oauthDomain, hooks};

export const xauth = async (username, password) => {
    const x = new Fanfou({
        ...opt,
        username,
        password
    });
    const token = await x.xauth();
    const {oauthToken, oauthTokenSecret} = token;
    if (oauthToken && oauthTokenSecret) {
        const o = new Fanfou({
            ...opt,
            oauthToken,
            oauthTokenSecret
        });
        const profile = await o.get('/account/verify_credentials', {});
        return {token, profile};
    }
    return null;
};

const initFanfou = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
        const {oauthToken, oauthTokenSecret} = token;
        const ff = new Fanfou({
            ...opt,
            oauthToken,
            oauthTokenSecret
        });
        return ff;
    }
};


export const getApi = (url, opt) => {
    const ff = initFanfou();
    return ff.get(url, {...opt});
};

export const postApi = (url, opt) => {
    const ff = initFanfou();
    return ff.post(url, {...opt});
};

export const getHomeTimeLine = opt => {
    const ff = initFanfou();
    return ff.get('/statuses/home_timeline', {...opt, format: 'html', count: 30});
};

export const getUserTimeLine = opt => {
    const ff = initFanfou();
    return ff.get('/statuses/user_timeline', {...opt, format: 'html', count: 30});
};

export const postStatus = opt => {
    const ff = initFanfou();
    return ff.post('/statuses/update', {...opt});
};

export const postPhoto = opt => {
    const ff = initFanfou();
    return ff.upload('/photos/upload', {...opt});
};

export const getUserInfo = opt => {
    const ff = initFanfou();
    return ff.get('/users/show', {...opt});
};

export const getTrends = () => {
    const ff = initFanfou();
    return ff.get('/trends/list');
};

export const getNotification = () => {
    const ff = initFanfou();
    return ff.get('/account/notification');
};

export const getFollowers = opt => {
    const ff = initFanfou();
    return ff.get('/users/followers', {...opt});
};

export const getFriends = opt => {
    const ff = initFanfou();
    return ff.get('/users/friends', {...opt});
};

export const getPhotos = opt => {
    const ff = initFanfou();
    return ff.get('/photos/user_timeline', {...opt});
};

export const getBlocks = opt => {
    const ff = initFanfou();
    return ff.get('/blocks/blocking', {...opt});
};

export const getConversation = opt => {
    const ff = initFanfou();
    return ff.get('/direct_messages/conversation_list', {...opt})
};

export const getConversationDetails = opt => {
    const ff = initFanfou();
    return ff.get('/direct_messages/conversation', {...opt})
};

export const postDestroyMessage = opt => {
    const ff = initFanfou();
    return ff.post('/direct_messages/destroy', {...opt})
};

export const postNewMessage = opt => {
    const ff = initFanfou();
    return ff.post('/direct_messages/new', {...opt})
};

export const getSearchTimeLine = opt => {
    const ff = initFanfou();
    return ff.get('/search/public_timeline', {...opt, format: 'html'})
};

export const getSearchUser = opt => {
    const ff = initFanfou();
    return ff.get('/search/users', {...opt})
};

export const getSearchUserTimeLine = opt => {
    const ff = initFanfou();
    return ff.get('/search/user_timeline', {...opt})
};

export const getMentions = opt => {
    const ff = initFanfou();
    return ff.get('/statuses/mentions', {...opt, format: 'html'})
};

export const postDelFavorites = opt => {
    const ff = initFanfou();
    return ff.post('/favorites/destroy/' + opt)
};

export const getFavoritesList = opt => {
    const ff = initFanfou();
    return ff.get('/favorites', {...opt, format: 'html'})
};

export const postFavorites = opt => {
    const ff = initFanfou();
    return ff.post('/favorites/create/' + opt)
};

export const postDelStatuses = opt => {
    const ff = initFanfou();
    return ff.post('/statuses/destroy', {...opt})
};

export const getShowStatuses = opt => {
    const ff = initFanfou();
    return ff.get('/statuses/show', {...opt, format: 'html'})
};

export const getContextStatuses = opt => {
    const ff = initFanfou();
    return ff.get('/statuses/context_timeline', {...opt, format: 'html'})
};

export const postAddFriend = opt => {
    const ff = initFanfou();
    return ff.post('/friendships/create', {...opt})
};

export const postDelFriend = opt => {
    const ff = initFanfou();
    return ff.post('/friendships/destroy', {...opt})
};

export const getRequestFriend = opt => {
    const ff = initFanfou();
    return ff.get('/friendships/requests', {...opt})
};

export const postDenyFriend = opt => {
    const ff = initFanfou();
    return ff.post('/friendships/deny', {...opt})
};

export const postAcceptFriend = opt => {
    const ff = initFanfou();
    return ff.post('/friendships/accept', {...opt})
};



