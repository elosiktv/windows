import db from '../../indexedDB/db';

export const getLocalStorageJSON = () => {
    return dispatch => {
        let appJSON = JSON.parse(localStorage.getItem('app'));

        if (appJSON) {
            dispatch({
                type: 'GET_LOCAL_STORAGE_SUCCESS',
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
            wallpapers: {
                active: 'https://images.unsplash.com/photo-1498598457418-36ef20772bb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
                0: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-633064.jpg',
                1: 'https://images.unsplash.com/photo-1498598457418-36ef20772bb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
            },
            taskbarContext: false,
            files: {
                0: {
                    name: 'Plik testowy',
                    type: 'txt',
                    background: 'http://icons.iconarchive.com/icons/pelfusion/flat-file-type/256/txt-icon.png',
                    text: 'THIS IS JUST SIMPLE TEXT',
                    index: 0,
                    xPosition: null,
                    yPosition: null
                },
                1: {
                    name: 'Pliczuś',
                    type: 'txt',
                    background: 'http://icons.iconarchive.com/icons/pelfusion/flat-file-type/256/txt-icon.png',
                    text: 'NOTEPAD :D',
                    index: 1,
                    xPosition: null,
                    yPosition: null
                },
                10: {
                    name: 'Youtube link',
                    type: 'link',
                    href: 'https://www.youtube.pl',
                    index: 10,
                    background: 'http://icons.iconarchive.com/icons/danleech/simple/256/youtube-icon.png',
                    xPosition: null,
                    yPosition: null
                },
                11: {
                    name: 'BEEP',
                    type: 'audio',
                    index: 11,
                    background: 'https://image.flaticon.com/icons/svg/337/337944.svg',
                    xPosition: null,
                    yPosition: null
                }
            }
        } 
        localStorage.setItem('app', JSON.stringify(appJSON));
        let applications = {
            musicPlayer: false,
            videoPlayer: false,
            active: {
                0: {
                    name: 'Plik testowy',
                    type: 'txt',
                    background: 'http://icons.iconarchive.com/icons/pelfusion/flat-file-type/256/txt-icon.png',
                    text: 'THIS IS JUST SIMPLE TEXT',
                    index: 0,
                    xPosition: null,
                    yPosition: null
                }
            }
        }
        localStorage.setItem('running', JSON.stringify(applications));
        dispatch({
            type: 'CREATE_LOCAL_STORAGE_SUCCESS',
            data: JSON.parse(localStorage.getItem('app'))
        });
    }
}

export const saveChanges = data => {
    return dispatch => {
        localStorage.setItem('app', JSON.stringify(data));
        dispatch({
            type: 'SAVE_LOCAL_STORAGE_SUCCESS',
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
            type: 'GET_RUNNING_APPS_SUCCESS',
            data: apps
        });
    }
}

export const addRunningAppToLocalStorage = (runningApps, app) => {
    return dispatch => {
        let lastValue = parseInt(Object.keys(runningApps.active)[Object.keys(runningApps.active).length - 1]);
        if (app.index !== lastValue) {
            runningApps.active[app.index] = app;
            runningApps.active[app.index].minimalized = false;
            runningApps.active[app.index].xPosition = null;
            runningApps.active[app.index].yPosition = null;
            localStorage.setItem('running', JSON.stringify(runningApps));
            dispatch({
                type: 'ADD_RUNNING_APP_SUCCESS',
                data: JSON.parse(localStorage.getItem('running'))
            });
        } else {
            dispatch(toggleMinimalizeApp(runningApps, app.index));
        }
    }
}

export const removeRunningAppFromLocalStorage = (runningApps, appIndex) => {
    return dispatch => {
        delete runningApps.active[appIndex];
        localStorage.setItem('running', JSON.stringify(runningApps));
        dispatch({
            type: 'REMOVE_RUNNING_APP_SUCCESS',
            data: JSON.parse(localStorage.getItem('running'))
        })
    }
}

export const toggleMinimalizeApp = (runningApps, appIndex) => {
    return dispatch => {
        runningApps.active[appIndex].minimalized = !runningApps.active[appIndex].minimalized;
        localStorage.setItem('running', JSON.stringify(runningApps));
        dispatch({
            type: 'TOGGLE_MINIMALIZE_APP_SUCCESS',
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
            type: 'SAVE_RUNNING_APP_POSITION_SUCCESS',
            data: runningApps
        });
    }
}

export const changeFileName = (data, name, appIndex) => {
    return dispatch => {
        data.files[appIndex].name = name;
        localStorage.setItem('app', JSON.stringify(data));
        dispatch({
            type: 'CHANGE_APP_NAME_SUCCESS',
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
        delete data.files[appIndex];
        localStorage.setItem('app', JSON.stringify(data));
        dispatch({
            type: 'REMOVE_FILE_SUCCESS',
            data: JSON.parse(localStorage.getItem('app'))
        });
    }
}