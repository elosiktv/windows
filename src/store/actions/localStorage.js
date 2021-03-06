import db from '../../indexedDB/db';

export const getLocalStorageJSON = () => {
    return dispatch => {
        let appJSON = JSON.parse(localStorage.getItem('app'));

        if (appJSON) {
            dispatch({
                type: 'REFRESH_DATA',
                data: appJSON
            });
        } else {
            dispatch({
                type: 'GET_LOCAL_STORAGE_FAILED'
            });
            dispatch(initLocalStorageJSON());
        }
    }
}

export const initLocalStorageJSON = () => {
    return dispatch => {
        let appJSON = {
            name: 'Anonymous',
            city: 'Unknown',
            wallpapers: {
                active: 'https://images.unsplash.com/photo-1498598457418-36ef20772bb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
                0: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-633064.jpg',
                1: 'https://images.unsplash.com/photo-1498598457418-36ef20772bb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
            },
            taskbarContext: false,
            files: {
                0: {
                    name: 'Text file',
                    type: 'txt',
                    background: 'http://icons.iconarchive.com/icons/pelfusion/flat-file-type/256/txt-icon.png',
                    text: 'THIS IS JUST SIMPLE TEXT',
                    index: 0,
                    xPosition: null,
                    yPosition: null,
                    password: null
                },
                1: {
                    name: 'Youtube link',
                    type: 'link',
                    href: 'https://www.youtube.pl',
                    index: 1,
                    background: 'http://icons.iconarchive.com/icons/danleech/simple/256/youtube-icon.png',
                    xPosition: null,
                    yPosition: null,
                    password: null
                }
            }
        } 
        localStorage.setItem('app', JSON.stringify(appJSON));
        let applications = {
            active: {}
        }
        localStorage.setItem('running', JSON.stringify(applications));
        dispatch({
            type: 'REFRESH_DATA',
            data: JSON.parse(localStorage.getItem('app'))
        });
    }
}

export const saveChanges = data => {
    return dispatch => {
        localStorage.setItem('app', JSON.stringify(data));
        dispatch({
            type: 'REFRESH_DATA',
            data: data
        })
    }
}

export const saveFilePosition = (data, xPosition, yPosition, fileIndex) => {
    return dispatch => {
        if (data.files[fileIndex]) {
            data.files[fileIndex].xPosition = xPosition;
            data.files[fileIndex].yPosition = yPosition;
            dispatch(saveChanges(data));
        }
    }
}

export const getRunningApplications = () => {
    return dispatch => {
        let apps = JSON.parse(localStorage.getItem('running'));
        dispatch({
            type: 'REFRESH_RUNNING_DATA',
            data: apps
        });
    }
}

export const addRunningAppToLocalStorage = (runningApps, app) => {
    return dispatch => {
        let lastValue = parseInt(Object.keys(runningApps.active)[Object.keys(runningApps.active).length - 1]);
        let index = isNaN(lastValue) ? 0 : lastValue + 1;
        let appIndex = app.index;
        runningApps.active[index] = app;
        runningApps.active[index].fileIndex = index;
        runningApps.active[index].index = appIndex;
        runningApps.active[index].minimalized = false;
        runningApps.active[index].xPosition = null;
        runningApps.active[index].yPosition = null;
        localStorage.setItem('running', JSON.stringify(runningApps));
        dispatch({
            type: 'REFRESH_RUNNING_DATA',
            data: JSON.parse(localStorage.getItem('running'))
        });
    }
}

export const removeRunningAppFromLocalStorage = (runningApps, appIndex) => {
    return dispatch => {
        delete runningApps.active[appIndex];
        localStorage.setItem('running', JSON.stringify(runningApps));
        dispatch({
            type: 'REFRESH_RUNNING_DATA',
            data: JSON.parse(localStorage.getItem('running'))
        })
    }
}

export const toggleMinimalizeApp = (runningApps, appIndex, index) => {
    return dispatch => {
        try {
            runningApps.active[appIndex].minimalized = !runningApps.active[appIndex].minimalized;
        } catch {
            runningApps.active[index].minimalized = !runningApps.active[index].minimalized;
        }
        localStorage.setItem('running', JSON.stringify(runningApps));
        dispatch({
            type: 'REFRESH_RUNNING_DATA',
            data: JSON.parse(localStorage.getItem('running'))
        })
    }
}

export const saveProgramPosition = (runningApps, xPosition, yPosition, appIndex) => {
    return dispatch => {
        runningApps.active[appIndex].xPosition = xPosition;
        runningApps.active[appIndex].yPosition = yPosition;
        localStorage.setItem('running', JSON.stringify(runningApps));
        dispatch({
            type: 'REFRESH_RUNNING_DATA',
            data: runningApps
        });
    }
}

export const changeFileName = (data, name, appIndex) => {
    return dispatch => {
        data.files[appIndex].name = name;
        localStorage.setItem('app', JSON.stringify(data));
        dispatch({
            type: 'REFRESH_DATA',
            data: JSON.parse(localStorage.getItem('app'))
        })
    }
}

export const removeFile = (data, appIndex) => {
    return dispatch => {
        if (data.files[appIndex].type === 'audio') {
            db.audios.where('index').equals(Number(appIndex)).delete();
        }
        if (data.files[appIndex].type === 'video') {
            db.videos.where('index').equals(Number(appIndex)).delete();
        }
        if (data.files[appIndex].type === 'image') {
            db.images.where('index').equals(Number(appIndex)).delete();
        }
        delete data.files[appIndex];
        localStorage.setItem('app', JSON.stringify(data));
        dispatch({
            type: 'REFRESH_DATA',
            data: JSON.parse(localStorage.getItem('app'))
        });
    }
}