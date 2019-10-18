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
    $.widget('mage.logsjs', {
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
            detailViewUrl: '',
            fileUpdateUrl: '',
            cacheUrl: '',
            detailViewId: 0,
            clearLogsUrl: '',
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
                resizableRows:true,
                columns: columns.getLogsList(),
                initialSort:[{
                    column: 'index',
                    dir: 'asc'
                }],
                rowClick: function (e, row) {
                    var rowData = row.getData();
                    if (rowData.is_readable == '1') {
                        core.loadRowDetails(self, rowData, false);
                    } else {
                        alert(__('This file is not readable. Please check the file permissions.'));
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

            // Clear logs
            actions.initLogsButton(this);

            // Flush cache
            actions.initCacheButton(this);
        }
    });

    return $.mage.logsjs;
});