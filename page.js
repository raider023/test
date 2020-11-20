class myRequest {
	
    /**
     * properties
     * @param 'String' _url - url request
     * @param 'String' _form - form class
     * @param 'String' _type - request type (GET, POST, PUT, DELETE)
     * @parat {Object} _headers - request headers (Authorization, Accept, Content-Type...)
     * @param [Array] _data - request params
     */

    constructor () {
        this._url = '';
        this._form = '';
        this._type = '';
        this._headers = {};
        this._data = [];
    }

    /**
     * Method set url
     */

    setUrl (url) {
        if (typeof url === 'string' && url.trim().length) {
            this._url = url.trim();
            return true;
        }
        return false;
    }

    /**
     * Method set form
     */

    setForm (form) {
        if (typeof form === 'string' && form.trim().length) {
            this._form = form.trim();
            return true;
        }
        return false;
    }

    /**
     * Method set type
     */

    setType (type) {
        if (typeof type === 'string' && type.trim().length) {
            this._type = type.trim();
            return true;
        }
        return false;
    }

    /**
     * Method set headers
     */

    setHeaders (headers) {
        if (typeof headers === 'object') {
            this._headers = headers;
            return true;
        }
        return false;
    }

    /**
     * Method set headers
     */

    setData (data) {
        if (typeof data === 'object') {
            this._data = data;
            return true;
        }
        return false;
    }


    /**
     * Method to collect checked input with type checkbox
     */

    getSelectedCheckboxValues (source) {
        const checkboxes = document.querySelectorAll(`${source}:checked`);
        let values = [];
		
        checkboxes.forEach((checkbox) => {
            values.push(checkbox.value);
        });
		
        return values;
    }

    /**
     * Method dispatcher input data
     */

    collect(data) {
        this.setUrl(data.url);
        this.setForm(data.form);
        this.setHeaders(data.headers);
        this.setType(data.type);
        this.setData(data.data);
    }

    /**
     * Method building data for request
     */

    buildData() {
        let rData = {};
        for (let i = 0; i < this._data.length; i++) {
            let type = this._data[i]['type'],
                name = this._data[i]['name'],
                source = this._data[i]['source'];

            if (type == 'checkbox') {
                rData[name] = this.getSelectedCheckboxValues(source)
            } else if(type == 'date') {
                let fDate = document.querySelector(source).value,
                    fDateArr = fDate.split('.'),
                    fDateDay = fDateArr[0],
                    fDateMonth = fDateArr[1],
                    fDateYear = fDateArr[2],
                    nDate = `${fDateYear}-${fDateMonth}-${fDateDay}`;
                rData[name] = nDate
            } else {
                rData[name] = document.querySelector(source).value
            }
        }

        return rData
    }

    /**
     * Method validate data before sending request
     */

    validateForm () {
        let isError = false;
        let self = this;
        for (let i = 0; i < this._data.length; i++) {

            let type = this._data[i]['type'],
                source = this._data[i]['source'],
                errorEl = document.querySelector(`${source}-error`),
                errorElClassLis = errorEl.classList;

            if (type === 'checkbox') {
                if(!this.getSelectedCheckboxValues(source).length) {
                    errorElClassLis.remove('hidden');
                    isError = true;
                } else {
                    errorElClassLis.add('hidden')
                }
            } else if(type === 'file') {
				if (!document.querySelector(source).files.length) {
					errorElClassLis.remove('hidden')
					isError = true;
				} else {
					errorElClassLis.add('hidden')
				}
            } else {
                if(!document.querySelector(source).value.length) {
                    errorElClassLis.remove('hidden')
                    isError = true;
                } else {
                    errorElClassLis.add('hidden')
                }
            }
        }

        return isError
    }

    /**
     * Method that adding event && render error alerts && do reload after success 
     */

    render(data) {
        this.collect(data);

        let self = this;

        document.querySelector(this._form).addEventListener('submit', function (e) {
            e.preventDefault();

            if (self.validateForm()) {
                return false;
            }

            axios({
                headers: self._headers,
                method: self._type,
                url: self._url,
                data: self.buildData()
            })
                .then(function (response) {
					let reloadPage = document.querySelector(self._form).getAttribute('data-name');
					location.replace(`/${reloadPage}/`);
                })
                .catch(function (error) {
                    console.log(`error: ${error}`);
                    document.querySelector('.js-error-alert').classList.remove('hidden');
                });
        });
    }

        this.collect(data);

        let self = this;

        document.querySelector(this._form).addEventListener('submit', function (e) {
            e.preventDefault();

            if (self.validateForm()) {
                return false;
            }

            axios({
                headers: self._headers,
                method: self._type,
                url: self._url,
                data: self.buildLangData()
            })
                .then(function (response) {
                    if(self._type === 'POST') {
                        let reloadPage = document.querySelector(self._form).getAttribute('data-name');
                        location.replace(`/${reloadPage}/`);
                    } else if(self._type === 'PUT') {
                        document.querySelector(`${self._form}-success`).classList.remove('hidden')
                    } else {
                        console.log(response)
                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }
}
