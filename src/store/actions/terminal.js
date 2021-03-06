import { removeFile, removeRunningAppFromLocalStorage, addRunningAppToLocalStorage } from './localStorage';

export const runTerminalApplication = runningApps => {
    return dispatch => {
        let lastValue = parseInt(Object.keys(runningApps.active)[Object.keys(runningApps.active).length - 1]);
        runningApps.active[isNaN(lastValue) ? 0 : lastValue + 1] = {
            background: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/terminal-512.png',
            name: 'Terminal',
            type: 'terminal',
            index: isNaN(lastValue) ? 0 : lastValue + 1,
            minimalized: false
        }
        localStorage.setItem('running', JSON.stringify(runningApps));
        dispatch({
            type: 'REFRESH_RUNNING_DATA',
            data: JSON.parse(localStorage.getItem('running'))
        })
    }
}

export const help = () => {
    return dispatch => {
        let output = `
            <p>> help</p>
            <p>echo</p>
            <p>cls</p>
            <p>calculator</p>
            <p>author</p>
            <p>touch</p>
            <p>exit</p>
            <p>whoami</p>
            <p>ls</p>
            <p>rm</p>
            <p>href</p>
            <p>rename</p>
            <p>passfile</p>
            <p>passfilerm</p>
            <p>kill</p>
            <p>exec</p>
            <p>ps</p>
        `
        dispatch({
            type: 'UPDATE_OUTPUT',
            data: output
        })
    }
}

export const echo = (inProgram, value) => {
    return dispatch => {
        let text = value.replace('echo', '');
        let output = `
            <p>> echo ${text}</p>
            <p>${text}</p>
        `
        dispatch({
            type: 'UPDATE_OUTPUT',
            data: output
        })
    }
}

export const author = () => {
    return dispatch => {
        let output = `
            <p>> author</p>
            <p>Daniel Dąbrowski</p>
            <p>www.github.com/elosiktv</p>
        `
        dispatch({
            type: 'UPDATE_OUTPUT',
            data: output
        })
    }
}

export const calculator = (inProgram, value) => {
    return dispatch => {
        if (!inProgram) {
            dispatch({
                type: 'SET_PROGRAM',
                data: {program: 'calculator', output: `<p>> calculator</p><p>Type 'stop' to stop calculator</p>`}
            });
        } else {
            if (value.match(/^[0-9/\W/]+$/)) {
                dispatch({
                    type: 'UPDATE_OUTPUT',
                    // eslint-disable-next-line
                    data: `<p>calculator> ${value}</p><p>${eval(value)}</p>`
                })
            } else {
                if (value === 'stop') {
                    dispatch({
                        type: 'REMOVE_PROGRAM',
                        data: `<p>calculator> stop</p>`
                    })
                }
            }
        }
    }
}

export const touch = (inProgram, value) => {
    return dispatch => {
        let name = value.replace('touch', '');
        if (name) {
            let app = JSON.parse(localStorage.getItem('app'));
            let lastValue = parseInt(Object.keys(app.files)[Object.keys(app.files).length - 1]);
            app.files[isNaN(lastValue) ? 0 : lastValue + 1] = {
                name: name,
                type: 'txt',
                background: 'http://icons.iconarchive.com/icons/pelfusion/flat-file-type/256/txt-icon.png',
                text: '',
                index: isNaN(lastValue) ? 0 : lastValue + 1,
                xPosition: null,
                yPosition: null
            }
            localStorage.setItem('app', JSON.stringify(app));
            dispatch({
                type: 'REFRESH_DATA',
                data: JSON.parse(localStorage.getItem('app'))
            })
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> touch ${name}</p><p>Created txt file with name: ${name}</p>`
            })
        } else {
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> touch</p><p>Correct syntax: touch "file name"</p>`
            })
        }
    }
}

export const whoami = () => {
    return dispatch => {
        let app = JSON.parse(localStorage.getItem('app'));
        dispatch({
            type: 'UPDATE_OUTPUT',
            data: `<p>> whoami</p><p>${app.name}</p>`
        })
    }
}

export const ls = () => {
    return dispatch => {
        let app = JSON.parse(localStorage.getItem('app'));
        let output;
        Object.keys(app.files).map(item => {
            output += `<p>${item} ${app.files[item].name}.${app.files[item].type}</p>`
            return null;
        })
        dispatch({
            type: 'UPDATE_OUTPUT',
            data: `<p>> ls</p><p>${output.replace('undefined', '')}</p>`
        })
    }
}

export const rm = (inProgram, value) => {
    return dispatch => {
        let index = value.replace('rm', '');
        if (index !== '' && index.length !== 0 && isNaN(index) !== true) {
            let app = JSON.parse(localStorage.getItem('app'));
            dispatch(removeFile(app, parseInt(index)));
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> rm ${index}</p><p>file with index ${index} has been deleted</p>`
            })
        } else {
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> rm</p><p>Correct syntax: rm "file index"</p><p>Use 'ls' to get file index</p>`
            })
        }
    }
}

export const href = (inProgram, value) => {
    return dispatch => {
        let site = value.replace('href', '');
        if (site) {
            if (!(site.indexOf('http') > -1 || site.indexOf('https') > -1)) {
                window.open(`https://${site.replace(/ /g, '')}`);
            } else {
                window.open(site);
            }
        } else {
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> href</p><p>Correct syntax: href "url"</p>`
            })
        }
    }
}

export const rename = (inProgram, value) => {
    return dispatch => {
        let argument = value.replace('rename', '');
        let index = argument.split(' ')[1];
        let name = value.replace('rename', '').replace(index, '');
        if (index && name) {
            let app = JSON.parse(localStorage.getItem('app'));
            app.files[index].name = name;
            localStorage.setItem('app', JSON.stringify(app));
            dispatch({
                type: 'REFRESH_DATA',
                data: JSON.parse(localStorage.getItem('app'))
            })
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> rename ${index} ${name}</p><p>Name changed for file ${index}</p>`
            })
        } else {
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> rename ${index ? index : ''} ${name ? name : ''}</p><p>Correct syntax: rename "index" "name"</p><p>Use 'ls' to get file index</p>`
            })   
        }
    }
}

export const passfile = (inProgram, value) => {
    return dispatch => {
        let argument = value.replace('passfile', '');
        let index = argument.split(' ')[1];
        let password = argument.split(' ')[2];
        if (index && password) {
            let app = JSON.parse(localStorage.getItem('app'));
            app.files[index].password = password;
            localStorage.setItem('app', JSON.stringify(app));
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> passfile ${index} ${password}</p><p>Password changed for file with index: ${index}</p>`
            })
            dispatch({
                type: 'REFRESH_DATA',
                data: JSON.parse(localStorage.getItem('app'))
            })
        } else {
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> passfile ${index ? index : ''} ${password ? password : ''}</p><p>Correct syntax: passfile "index" "password"</p><p>Use 'ls' to get file index</p><p>Use 'passfilerm' to remove password</p>`
            })
        }
    }
}

export const passfilerm = (inProgram, value) => {
    return dispatch => {
        let index = parseInt(value.replace('passfilerm', ''));
        if (index !== '' && index.length !== 0 && isNaN(index) !== true) {
            let app = JSON.parse(localStorage.getItem('app'));
            app.files[index].password = null;
            localStorage.setItem('app', JSON.stringify(app));
            dispatch({
                type: 'REFRESH_DATA',
                data: JSON.parse(localStorage.getItem('app'))
            })
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> passfilerm ${index}</p><p>Password removed for file with index: ${index}</p>`
            })
        } else {
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> passfilerm </p><p>Correct syntax: passfilerm "index"</p><p>Use 'ls' to get file index</p>`
            })
        }
    }
}

export const kill = (inProgram, value) => {
    return dispatch => {
        let index = parseInt(value.replace('kill', ''));
        let running = JSON.parse(localStorage.getItem('running'));
        if (index !== '' && index.length !== 0 && isNaN(index) !== true) {
            dispatch(removeRunningAppFromLocalStorage(running, index));
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> kill ${index}</p><p>Program with index ${index} has been killed</p>`
            })
        } else {
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> kill </p><p>Correct syntax: kill "index"</p><p>Use 'ps' to get active programs</p>`
            })
        }
    }
}

export const date = () => {
    return dispatch => {
        dispatch({
            type: 'UPDATE_OUTPUT',
            data: `<p>> date </p><p>${new Date()}</p>`
        })
    }
}

export const exec = (inProgram, value) => {
    return dispatch => {
        let index = parseInt(value.replace('exec', ''));
        let running = JSON.parse(localStorage.getItem('running'));
        let app = JSON.parse(localStorage.getItem('app'));
        if (index !== '' && index.length !== 0 && isNaN(index) !== true) {
            if (app.files[index].password) {
                let passwordPrompt = prompt('Password: ');
                if (passwordPrompt) {
                    if (passwordPrompt !== app.files[index].password) {
                        exec(inProgram, value);
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (app.files[index].type === 'link') {
                window.open(app.files[index].href);
            } else {
                dispatch(addRunningAppToLocalStorage(running, app.files[index]));
            }
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> exec ${index}</p><p>Program with index ${index} started</p>`
            })
        } else {
            dispatch({
                type: 'UPDATE_OUTPUT',
                data: `<p>> exec </p><p>Correct syntax: exec "index"</p><p>Use 'ls' to get file index</p>`
            })
        }
    }
}

export const clearOutput = () => {
    return dispatch => {
        dispatch({
            type: 'CLEAR_OUTPUT'
        })
    }
}

export const ps = () => {
    return dispatch => {
        let running = JSON.parse(localStorage.getItem('running'));
        let output;
        Object.keys(running.active).map(item => {
            output += `<p>${item} ${running.active[item].name}.${running.active[item].type}</p>`
            return null;
        })
        dispatch({
            type: 'UPDATE_OUTPUT',
            data: `<p>> ps</p><p>${output.replace('undefined', '')}</p>`
        })
    }
}