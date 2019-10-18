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
        'Naxero_Translation/js/translation/filters',
        'mage/translate',
        'mage/cookies'
    ],
    function ($, filters, __) {
        'use strict';

        // Define constants
        const PAGER_SELECTOR = 'translation-paging-filter';
        const DEFAULT_PAGER_VALUE = 50;

        // Return the component
        return {
            initCache: function () {
                var collection = {};

                function get_from_cache(selector)
                {
                    if (undefined === collection[selector]) {
                        collection[selector] = $(selector);
                    }
    
                    return collection[selector];
                }
    
                return { _: get_from_cache };
            },

            callMethod: function (obj, method, args) {
                if (typeof obj[method] === 'function') {
                    (typeof args === 'undefined') ? obj[method]() : obj[method](args);
                }
            },

            /**
             * Show a message.
             */
            showMessage: function (com, type, message) {
                // Prepare the variables
                var self = this;
                var messageHtml = $('<div class="message"></div>');

                // Clear any existing message
                this.clearMessages(com);

                // Build the message to display
                messageHtml.addClass('message-' + type + ' ' + type);
                messageHtml.append('<div>' + __(message) + '</div>');
                messageHtml.insertBefore('.tabulator-header');
                messageHtml.show(400, function() {
                    var displayed = $(this);
                    setTimeout(function() {
                        displayed.hide('slow');
                        self.clearMessages(com);
                    }, 5000);
                });
            },

            /**
             * Clear all messages.
             */
            clearMessages: function (com) {
                $('.message').hide().remove();
            },

            getDownloadFileName: function () {
                var fileName = 'trans_' + Date.now() + '.csv';
                return fileName;
            },

            setPaging: function (com, targetTable, val) {
                // Prepare the pager value
                var val = val || $.cookie(PAGER_SELECTOR) || DEFAULT_PAGER_VALUE;

                // Set the pager value
                com.cache._(targetTable).tabulator('setPageSize', val);

                // Save the pager value
                $.cookie(PAGER_SELECTOR, val);

                // Update the pager select state
                com.cache._('.' + PAGER_SELECTOR).val(val);
            },

            getDetailColumns: function (com) {
                var self = this;
                return [
                    {title: __('File Id'), field: 'file_id', sorter: 'number', visible: false},
                    {title: __('#'), field: 'index', sorter: 'number', width: 70, visible: false},
                    {title: __('Read'), field: 'is_readable', sorter: 'number', formatter: 'tickCross', width: 85, visible: false},
                    {title: __('Write'), field: 'is_writable', sorter: 'number', formatter: 'tickCross', width: 90, visible: false},
                    {title: __('Is error'), field: 'is_error', sorter: 'number', width: 90, visible: false},
                    {title: __('Row Id'), field: 'row_id', sorter: 'number', visible: false},
                    {title: __('Key'), field: 'key', sorter: 'string', headerFilter: 'input', headerFilterPlaceholder: __('Search...'), formatter: 'textarea', editor: 'input'},
                    {title: __('Value'), field: 'value', sorter: 'string', headerFilter: 'input', headerFilterPlaceholder: __('Search...'), formatter: 'textarea', editor: 'input'},
                    {
                        title: '',
                        field: 'delete',
                        width: 50,
                        headerSort: false,
                        formatter: function (cell, formatterParams, onRendered) {
                            return '&ominus;';
                        },
                        cellClick: function (e, cell) {
                            // Get the row
                            var row = cell.getRow();

                            // Get the row data
                            var rowData = row.getData();

                            // Delete the row in file
                            self.deleteRow(
                                com,
                                {
                                    fileId: rowData.file_id,
                                    rowId: rowData.row_id
                                }
                            );

                            // Delete the row in table
                            row.delete();
                        }
                }
                ];
            },

            getData: function (com) {
                // Prepare the variables
                var self = this;
                var requestData = {
                    form_key: window.FORM_KEY
                };

                // Send the request
                $.ajax({
                    type: 'POST',
                    url: com.options.dataUrl,
                    dataType: 'json',
                    showLoader: true,
                    data: requestData,
                    success: function (data) {
                        // Set the table data
                        self.prepareData(com, com.options.targetTable, data);

                        // Set the table paging
                        self.setPaging(com, com.options.targetTable);

                        // Build options for the lists
                        filters.build(com, data);
    
                        // Add the list events
                        filters.addEvents(com);

                        // Handle invalid rows display
                        if (data.error_data) {
                            self.displayFileErrors(com, data);
                        }
                    },
                    error: function (request, status, error) {
                        self.showMessage(com, 'error', error);
                    }
                });
            },

            prepareData: function (com, targetTable, data) {
                // Prepare variables
                var noResultsClassName = 'no-results';
                var containerClassName = 'tabulator-tableHolder';
                var rowsCount = data.table_data.length;
                var errorsCount = (data.error_data) ? data.error_data.length : 0;

                // Set the rows count header
                this.setRowsCount(com, targetTable, rowsCount, errorsCount);

                // Remove the no results div if exists
                com.cache._(targetTable)
                .find('.' + containerClassName + ' .' + noResultsClassName)
                .remove();

                // Clear the table data
                com.cache._(targetTable).tabulator('clearData');

                // Handle the no results state
                if (rowsCount != 0) {
                    // Set the table data
                    com.cache._(targetTable).tabulator('setData', data.table_data);
                } else {
                    // Prepare the no results HTML
                    var html = '<div class="'+ noResultsClassName +'">';
                    html += __('No results found.');
                    html += '</div>';

                    // Prepend the HTML
                    com.cache._(targetTable).find('.' + containerClassName).prepend(html);
                }
            },

            setRowsCount: function (com, targetTable, rowsCount, errorsCount) {
                // Prepare the html
                var className = 'translation-rows-count';
                var html = '<div class="' + className + '">';
                html += '<span>' + __('Rows') + ':&nbsp;' + rowsCount + '</span>';
                html += '<span class="err">&nbsp;-&nbsp;';
                html += __('Errors') + ':&nbsp;' + errorsCount + '</span>&nbsp;';
                html += '</div>';

                // Remove the previous count
                com.cache._(targetTable)
                .find('.' + className)
                .remove();

                // Insert the new count
                com.cache._(targetTable).prepend(html);
            },

            createFile: function (com, params) {
                // Prepare the data
                var self = this;
                var requestData = params;
                requestData.form_key = window.FORM_KEY;

                // Send the request
                $.ajax({
                    type: 'POST',
                    url: com.options.newFileUrl,
                    dataType: 'json',
                    showLoader: true,
                    data: requestData,
                    success: function (response) {
                        var msgType = response.success ? 'success' : 'error';
                        self.showMessage(com, msgType, response.message);
                        self.getData(com);
                    },
                    error: function (request, status, error) {
                        self.showMessage(com, 'error', error);
                    }
                });
            },

            updateFileIndex: function (com, updateMode) {
                // Prepare the variables
                var self = this;
    
                // Prepare the data
                var requestData = {
                    update_mode: updateMode,
                    form_key: window.FORM_KEY
                };

                // Send the request
                $.ajax({
                    type: 'POST',
                    url: com.options.scanUrl,
                    dataType: 'json',
                    showLoader: true,
                    data: requestData,
                    success: function (response) {
                        var msgType = response.success ? 'success' : 'error';
                        self.showMessage(com, msgType, response.message);
                        self.getData(com);
                    },
                    error: function (request, status, error) {
                        self.showMessage(com, 'error', error);
                    }
                });
            },

            updateEntityData: function (com, data) {
                // Prepare the variables
                var self = this;
                var fileUpdateUrl = com.options.detailViewUrl;
                var requestData = {
                    row_content: data.rowContent,
                    action: 'update_data',
                    file_id: data.fileId,
                    form_key: window.FORM_KEY
                };
    
                // Send the the request
                $.ajax({
                    type: 'POST',
                    url: fileUpdateUrl,
                    data: requestData,
                    dataType: 'json',
                    success: function (res) {},
                    error: function (request, status, error) {
                        self.showMessage(com, 'error', error);
                    }
                });
            },

            deleteRow: function (com, data) {
                // Prepare the variables
                var self = this;
                var requestData = {
                    action: 'delete_row',
                    file_id: data.fileId,
                    row_id: data.rowId,
                    form_key: window.FORM_KEY
                };
    
                // Send the request
                $.ajax({
                    type: 'POST',
                    url: com.options.detailViewUrl,
                    data: requestData,
                    dataType: 'json',
                    showLoader: true,
                    success: function (res) {},
                    error: function (request, status, error) {
                        self.showMessage(com, 'error', error);
                    }
                });

                // Set the view edited state
                com.rowsCountEdited = true;
            },

            deleteFile: function (com, rowData) {
                // Prepare the variables
                var self = this;
                var requestData = {
                    action: 'delete_file',
                    file_id: rowData.file_id,
                    form_key: window.FORM_KEY
                };
    
                // Send the request
                $.ajax({
                    type: 'POST',
                    url: com.options.detailViewUrl,
                    data: requestData,
                    dataType: 'json',
                    showLoader: true,
                    success: function (response) {
                        var msgType = response.success ? 'success' : 'error';
                        self.showMessage(com, msgType, response.message);
                    },
                    error: function (request, status, error) {
                        self.showMessage(com, 'error', error);
                    }
                });
            },

            importFile: function (com, fileData, fileId) {
                // Prepare the request data
                var self = this;
                var requestData = new FormData();
                requestData.append('new_file_import', fileData);

                // Prepare the request Url
                var requestUrl = com.options.detailViewUrl;
                requestUrl += '?isAjax=true&action=import_data&file_id=' + fileId;
                requestUrl += '&form_key=' + window.FORM_KEY;
        
                // Send the request
                $.ajax({
                    type: 'POST',
                    url: requestUrl,
                    data: requestData,
                    contentType: false,
                    processData: false,
                    showLoader: true,
                    success: function (response) {
                        var msgType = response.success ? 'success' : 'error';
                        self.showMessage(com, msgType, response.message);
                        self.getRowDetails(com, fileId, false);
                    },
                    error: function (request, status, error) {
                        self.showMessage(com, 'error', error);
                    }
                });
            },

            loadRowDetails: function (com, rowData, isLogView) {
                // Prepare the variables
                var self = this;
    
                // Create the detail table
                com.cache._(com.options.detailView).tabulator({
                    langs: com.options.localeData,
                    pagination: 'local',
                    layout: 'fitColumns',
                    responsiveLayout: true,
                    height: '100%',
                    resizableRows: true,
                    columns: self.getDetailColumns(com),
                    cellEdited: function (cell) {
                        self.handleCellEdit(com, cell, true);
                    },
                    rowClick: function (e, row) {
                        self.handleCellEdit(com, row, false);
                    },
                    initialSort:[{
                        column: 'index',
                        dir: 'asc'
                    }]
                });

                // Set the file path
                com.cache._(com.options.detailViewFilePath).text(rowData.file_path);
    
                // Update the data
                this.getRowDetails(com, rowData.file_id, isLogView);
    
                // Move the panels
                this.togglePanes(com, rowData.file_id);
            },

            getRowDetails: function (com, fileId, isLogView) {
                // Prepare the variables
                var self = this;
                var requestData = {
                    action: 'get_data',
                    file_id: fileId,
                    form_key: window.FORM_KEY,
                    is_log_view: isLogView
                };

                // Send the the request
                $.ajax({
                    type: 'POST',
                    url: com.options.detailViewUrl,
                    dataType: 'json',
                    showLoader: true,
                    data: requestData,
                    success: function (data) {
                        // Set the table data
                        self.prepareData(com, com.options.detailView, data);

                        // Set the table paging
                        self.setPaging(com, com.options.detailView);
                        com.cache._('.' + PAGER_SELECTOR).on('change', function () {
                            let selectedKey = $(this).find(':selected').val();
                            self.setPaging(com, com.options.detailView, selectedKey);
                        });

                        // Handle invalid rows display
                        if (data.error_data) {
                            self.displayRowErrors(com, data);
                        }
                    },
                    error: function (request, status, error) {
                        self.showMessage(com, 'error', error);
                    }
                });
            },

            handleRowView: function (com, row) {
                var rowData = row.getData();
                if (rowData.is_readable == '1') {
                    this.loadRowDetails(com, rowData, false);
                } else {
                    alert(__('This file is not readable. Please check the file permissions.'));
                }
            },

            handleCellEdit: function (com, item, isCell) {
                var row = isCell ? item.getRow() : item;
                var rowData = row.getData();
                if (rowData.is_writable == '1') {
                    this.updateEntityData(
                        com,
                        {
                            fileId: rowData.file_id,
                            rowContent: rowData
                        }
                    );
                } else {
                    alert(__('This file is not writable. Please check the file permissions.'));
                }
            },

            displayRowErrors: function (com, data) {
                // Get the table rows
                var tableRows = com.cache._(com.options.detailView).tabulator('getRows');

                // Process the error display
                this.displayErrors(tableRows, data);
            },

            displayFileErrors: function (com, data) {
                // Get the table rows
                var tableRows = com.cache._(com.options.targetTable).tabulator('getRows');

                // Process the error display
                this.displayErrors(tableRows, data);
            },

            displayErrors(tableRows, data)  {
                tableRows.forEach(function (row) {
                    var rowIndex = row.getData().index;
                    if (data.error_data.indexOf(rowIndex) != -1) {
                        row.getElement().css({'background-color':'#FF9900'});
                    }
                });
            },

            togglePanes: function (com, fileId) {
                if (com.isListView) {
                    // Move main table
                    com.cache._('#translation-table-list').animate({ left: '-50px' });
                    com.cache._('#translation-table-list').hide();
    
                    // Show the details table
                    com.cache._('#translation-table-detail').show();
    
                    // Set the detail view state
                    com.isListView = false;
                    com.detailViewId = fileId;
                } else {
                    // Bring the panes back
                    com.cache._('#translation-table-detail').hide();
                    com.cache._('#translation-table-list').animate({ left: '0px' });
                    com.cache._('#translation-table-list').show();
    
                    // Set the detail view state
                    com.isListView = true;
                    com.detailViewId = 0;
                }
            }
        };
    }
);