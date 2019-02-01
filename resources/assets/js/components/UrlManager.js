import React, {Component} from 'react'
import PropTypes from 'prop-types'

window.onpopstate = () => {
    getUrlParams()
}

let UrlQueryParams = getUrlParams()

export default class UrlManager extends Component
{

    /**
     * Build the url parameters from and object
     *
     * @param params {Object}
     */
    static buildUrl(params)
    {
        return buildUrl(params)
    }

    /**
     * Return the list of parameters in the url with the value
     *
     * @returns {Object}
     */
    static getUrlParams()
    {
        return getUrlParams()
    }

    /**
     * Push the variables to the url
     *
     * @param params {Object}
     */
    static pushToUrl(params)
    {
        if (typeof params !== 'undefined') {
            setParams(params)

            const url = buildUrl()

            history.pushState(null, null, url)
        }
    }

    /**
     * Delete one or multiple parameters from the URL
     *
     * @param params s{Array} or {String}
     */
     static removeFromUrl(params)
     {
         if (typeof UrlQueryParams !== 'undefined') {
             if (Array.isArray(params)) {
                 for (let i = 0; i < params.length; i++) {
                     delete UrlQueryParams[params[i]]
                 }
             } else {
                 delete UrlQueryParams[params]
             }

             history.pushState(null, null, buildUrl())
         }

     }
}

/**
 * Build the URL from given parameters of from the parameter in the URL
 *
 * @param params
 * @returns {string}
 */
function buildUrl(params)
{
    const esc = encodeURIComponent

    // No params, build from the parameters already in the URL
    if (typeof params === 'undefined' || params.length === 0) {
        return '?' + Object.keys(UrlQueryParams).map(param => esc(param) + '=' + esc(UrlQueryParams[param])).join('&')
    }
    return '?' + Object.keys(params).map(param => esc(param) + '=' + esc(params[param])).join('&')
}

/**
 * Set or update the params
 *
 * @param params {Object}
 */
function setParams(params)
{
    if (typeof UrlQueryParams === 'undefined') {
        UrlQueryParams = params
    } else {
        Object.keys(params).map(key => {
            UrlQueryParams[key] = params[key]
        })
    }
}

/**
 * Return the list of parameters in the url with the value
 *
 * @returns {Object}
 */
function getUrlParams() {
    let query = new URLSearchParams(window.location.search)

    let entries = query.entries()
    let params = {}

    for (let entry of entries) {
        params[entry[0]] = entry[1]
    }

    return params
}