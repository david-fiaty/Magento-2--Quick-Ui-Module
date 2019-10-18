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
        'jquery',
        'Naxero_Translation/js/translation/core',
        'Naxero_Translation/js/translation/prompt',
        'mage/translate'
    ],
    function ($, core, prompt, __) {
        'use strict';

        // Return the component
        return {
            initNewFileButton: function (com) {
                com.cache._('#new-file').off().on('click', function () {
                    prompt.newFile(com);
                });
            },

            initImportDataButton: function (com) {
                com.cache._('#import-data').off().on('click', function () {
                    prompt.importData(com);
                });
            },

            initNewRowButton: function (com) {
                com.cache._('#add-row').off().on('click', function () {
                    // Remove the no results message if exists
                    com.cache._('.no-results').remove();

                    // Get the existing table data
                    var tableRows = com.cache._(com.options.detailView).tabulator('getRows');

                    // Prepare the new row data
                    var rowId = tableRows.length;
                    var newRowData = {
                        file_id: com.detailViewId.toString(),
                        index: rowId + 1,
                        is_readable: 1,
                        is_writable: 1,
                        row_id: rowId,
                        key: __('key...'),
                        value: __('value...')
                    };

                    // Add the new row
                    com.cache._(com.options.detailView).tabulator(
                        'addRow',
                        newRowData,
                        true
                    );
                    
                    // Set the sort
                    com.cache._(com.options.detailView).tabulator('setSort', "row_id", "desc");

                    // Update the file
                    core.updateEntityData(
                        com,
                        {
                            fileId: com.detailViewId.toString(),
                            rowContent: newRowData
                        }
                    );
                    
                    // Set the view edited state
                    com.rowsCountEdited = true;
                });
            },

            initBackButton: function (com) {
                com.cache._('#button-back').off().on('click', function () {
                    core.togglePanes(com, 0);
                    com.cache._(com.options.detailView).tabulator('destroy');
                    if (com.rowsCountEdited) {
                        core.getData(com);
                        com.rowsCountEdited = false;
                    }
                });
            },

            initDownloadButton: function (com) {
                com.cache._('#download-file').off().on('click', function () {
                    com.cache._(com.options.detailView).tabulator(
                        'download',
                        'csv',
                        core.getDownloadFileName()
                    );
                });
            },

            initScanButton: function (com) {
                com.cache._('#update-files').off().on('click', function () {
                    prompt.newScan(com);
                });
            },

            initCacheButton: function (com) {
                com.cache._('button[id^="flush-cache"]').off().on('click', function () {
                    // Prepare the data
                    var requestData = {
                        action: 'flush_cache',
                        form_key: window.FORM_KEY
                    };

                    // Send the request
                    $.ajax({
                        type: 'POST',
                        url: com.options.cacheUrl,
                        showLoader: true,
                        data: requestData,
                        success: function (response) {
                            var msgType = response.success ? 'success' : 'error';
                            core.showMessage(com, msgType, response.message);
                        },
                        error: function (request, status, error) {
                            core.showMessage(com, 'error', error);
                        }
                    });
                });
            },

            initLogsButton: function (com) {
                com.cache._('#clear-logs').off().on('click', function () {
                    // Prepare the data
                    var requestData = {
                        form_key: window.FORM_KEY
                    };

                    // Send the request
                    $.ajax({
                        type: 'POST',
                        url: com.options.clearLogsUrl,
                        showLoader: true,
                        data: requestData,
                        success: function (response) {
                            var msgType = response.success ? 'success' : 'error';
                            core.showMessage(com, msgType, response.message);
                            core.getData(com);
                        },
                        error: function (request, status, error) {
                            core.showMessage(com, 'error', error);
                        }
                    });
                });
            }
        };
    }
);