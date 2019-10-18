/**
 * Naxero.com
 * Professional ecommerce integrations for Magento
 *
 * PHP version 7
 *
 * @category  Magento2
 * @package   Naxero
 * @author    Platforms Development Team <contact@naxero.com>
 * @copyright Naxero.com
 * @license   https://opensource.org/licenses/mit-license.html MIT License
 * @link      https://www.naxero.com
 */

 var config = {
        map: {
            '*': {
                filesjs:  'Naxero_Translation/js/translation/files',
                stringsjs:  'Naxero_Translation/js/translation/strings',
                logsjs:  'Naxero_Translation/js/translation/logs'
            }
        },
        paths: {
            tabulator: 'Naxero_Translation/js/tabulator/tabulator'
        },
        shim: {
            tabulator: {
                deps: ['jquery', 'jquery/ui']
            }
        },
        urlArgs: "bust=" + (new Date()).getTime()
    };
