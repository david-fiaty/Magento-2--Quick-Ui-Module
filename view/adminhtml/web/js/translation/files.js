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

define([
    'jquery',
    'mage/translate',
    'Naxero_Translation/js/translation/core',
    'Naxero_Translation/js/translation/actions',
    'Naxero_Translation/js/translation/columns',
    'tabulator'
], function ($, __, core, actions, columns, tabulator) {
    'use strict';

    // Build the widget
    $.widget('mage.filesjs', {
        // Prepare the options
        cache: null,
        isListView: true,
        options: {
            targetTable: '#translation-table-content',
            detailView: '#translation-table-detail-content',
            detailViewFilePath: '#translation-file-path',
            localeData: {},
            dataUrl: '',
            scanUrl: '',
            promptUrl: '',
            newFileUrl: '',
            detailViewUrl: '',
            fileUpdateUrl: '',
            cacheUrl: '',
            detailViewId: 0,
            settings: {}
        },

        filters: {
            group: '#translation-group-filter',
            type: '#translation-type-filter',
            locale: '#translation-locale-filter',
            status: '#translation-status-filter'
        },

        _create: function () {
            this.cache = new core.initCache();
            this._bind();
        },

        _bind: function () {
            // Assign this to self
            var self = this;

            // Create the table
            this.cache._(this.options.targetTable).tabulator({
                langs: self.options.localeData,
                pagination: 'local',
                persistentSort: true,
                layout: 'fitColumns',
                responsiveLayout: true,
                height: '100%',
                resizableRows: true,
                columns: columns.getFilesList(self),
                initialSort:[{
                    column: 'index',
                    dir: 'asc'
                }],
                cellClick: function (e, cell) {
                    // Prepare the variables
                    var clickedField = cell.getColumn().getField();
                    var row = cell.getRow();
                    var rowData = row.getData();

                    // Handle the click cases
                    if (clickedField == 'delete') {
                        // Check core file deletion
                        if (self.options.settings.allow_core_files_deletion == '0' && rowData.is_core) {
                            alert(__('Deletion of core files is not allowed.'));
                        } else {
                            // Delete the file
                            core.deleteFile(self, rowData);

                            // Delete the row in table
                            row.delete();
                        }
                    } else {
                        core.handleRowView(self, row);
                    }
                }
            });

            // Load the data into the table
            core.getData(this);

            // Set the toolbar actions
            this.setToolbarActions();
        },

        setToolbarActions: function () {
            // Back button
            actions.initBackButton(this);

            // Trigger download of data.csv file
            actions.initDownloadButton(this);

            // File index update
            actions.initScanButton(this);

            // Flush cache
            actions.initCacheButton(this);

            // New file
            actions.initNewFileButton(this);

            // New row
            actions.initNewRowButton(this);

            // Import Data
            actions.initImportDataButton(this);
        }
    });

    return $.mage.filesjs;
});