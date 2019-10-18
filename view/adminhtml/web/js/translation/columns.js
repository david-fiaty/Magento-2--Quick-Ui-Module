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

define(
    [
        'Naxero_Translation/js/translation/core',
        'mage/translate',
    ],
    function (core, __) {
        'use strict';

        // Return the component
        return {
            getFilesList: function (com) {
                // Prepare the base columns
                var output = [
                    {title: __('#'), field: 'index', sorter: 'number', width: 70, visible: false},
                    {title: __('Id'), field: 'file_id', sorter: 'number', visible: false},
                    {title: __('Path'), field: 'file_path', sorter: 'string', headerFilter: 'input', headerFilterPlaceholder: __('Search...')},
                    {title: __('Read'), field: 'is_readable', sorter: 'number', formatter: 'tickCross', width: 85},
                    {title: __('Write'), field: 'is_writable', sorter: 'number', formatter: 'tickCross', width: 90},
                    {title: __('Created'), field: 'file_creation_time', sorter: 'string', visible: false},
                    {title: __('Updated'), field: 'file_update_time', sorter: 'string', visible: false},
                    {title: __('Rows'), field: 'rows_count', sorter: 'number', width: 85},
                    {title: __('Errors'), field: 'errors', sorter: 'number', width: 100},
                    {title: __('Is core'), field: 'is_core', sorter: 'number', width: 100, visible: false},
                    {title: __('Type'), field: 'file_type', sorter: 'string', width: 100},
                    {title: __('Group'), field: 'file_group', sorter: 'string', width: 100, visible: false},
                    {title: __('Locale'), field: 'file_locale', sorter: 'string', width: 100}
                ];

                // Add the delete column
                if (com.options.settings.allow_file_deletion == '1') {
                    output.push(
                        {
                            title: '',
                            field: 'delete',
                            width: 50,
                            headerSort: false,
                            formatter: function (cell, formatterParams, onRendered) {
                                return '&ominus;';
                            }
                        }
                    );
                }

                // Return the array
                return output;
            },

            getLogsList: function () {
                return [
                    {title: __('#'), field: 'index', sorter: 'number', width: 70, visible: false},
                    {title: __('Id'), field: 'id', sorter: 'number', visible: false},
                    {title: __('File Id'), field: 'file_id', sorter: 'string', visible: false},
                    {title: __('Path'), field: 'file_path', sorter: 'string', headerFilter: 'input', headerFilterPlaceholder: __('Search...'), width: 550},
                    {title: __('Read'), field: 'is_readable', sorter: 'number', formatter: 'tickCross', width: 85},
                    {title: __('Write'), field: 'is_writable', sorter: 'number', formatter: 'tickCross', width: 90},
                    {title: __('Row Id'), field: 'row_id', sorter: 'number', width: 100},
                    {title: __('Comments'), field: 'comments', formatter: 'textarea'}
                ];
            },

            getStringsList: function () {
                return [
                    {title: __('#'), field: 'index', sorter: 'number', width: 70, visible: false},
                    {title: __('Row Id'), field: 'row_id', sorter: 'number', visible: false},
                    {title: __('Is error'), field: 'is_error', sorter: 'number', width: 90, visible: false},
                    {title: __('Key'), field: 'key', sorter: 'string', headerFilter:'input', headerFilterPlaceholder: __('Search...'), formatter: 'textarea', editor: 'input'},
                    {title: __('Value'), field: 'value', sorter: 'string', headerFilter:'input', headerFilterPlaceholder: __('Search...'), formatter: 'textarea', editor: 'input'},
                    {title: __('Path'), field: 'file_path', sorter: 'string', headerFilter:'input', headerFilterPlaceholder: __('Search...'), width: 200},
                    {title: __('Read'), field: 'is_readable', sorter: 'number', formatter: 'tickCross', width: 85},
                    {title: __('Write'), field: 'is_writable', sorter: 'number', formatter: 'tickCross', width: 90},
                    {title: __('Created'), field: 'file_creation_time', sorter: 'string', visible: false},
                    {title: __('Updated'), field: 'file_update_time', sorter: 'string', visible: false},
                    {title: __('Type'), field: 'file_type', sorter: 'string', width: 100},
                    {title: __('Group'), field: 'file_group', sorter: 'string', width: 100, visible: false},
                    {title: __('Locale'), field: 'file_locale', sorter: 'string', width: 100}
                ];
            }
        };
    }
);