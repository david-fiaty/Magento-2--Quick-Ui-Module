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
        'Naxero_Translation/js/translation/core'
    ],
    function ($, core) {
        'use strict';

        const PAGER_SELECTOR = 'translation-paging-filter';

        // Return the component
        return {

            build: function (com, data) {
                if (com.filters && data.filter_data) {
                    // Create the group filter
                    this.createOptions(com, com.filters.group, data.filter_data.file_group);
        
                    // Create the type filter
                    this.createOptions(com, com.filters.type, data.filter_data.file_type);
        
                    // Create the locale filter
                    this.createOptions(com, com.filters.locale, data.filter_data.file_locale);
        
                    // Create the status filter
                    this.createOptions(com, com.filters.status, data.filter_data.file_status);
                }
            },

            addEvents: function (com) {
                var self = this;

                // Pager events
                com.cache._('.' + PAGER_SELECTOR).off().on('change', function () {
                    let selectedKey = $(this).find(':selected').val();
                    core.setPaging(com, com.options.targetTable, selectedKey);
                });

                // Filters events
                if (com.filters) {
                    var self = this;

                    // Prepare the fields
                    var fields = [
                        {selector: com.filters.group, field: 'file_group'},
                        {selector: com.filters.type, field: 'file_type'},
                        {selector: com.filters.locale, field: 'file_locale'}
                    ];
        
                    // Assign the events
                    $.each(fields, function (k, obj) {
                        com.cache._(obj.selector).off().on('change', function () {
                            let selectedKey = $(this).find(':selected').val();
                            self.update(
                                com,
                                {field: obj.field, type: '=', value: selectedKey}
                            );
                        });
                    });
                }

                // Detail errors filter
                com.cache._('#filter_detail_errors').off().on('click', function () {
                    if (com.cache._(this).is(':checked')) {
                        var filter = [{field: 'is_error', type: '=', value: '1'}];
                        com.cache._(com.options.detailView).tabulator('setFilter', filter);
                    } else {
                        com.cache._(com.options.detailView).tabulator('clearFilter');
                    }
                });

                // Files errors filter
                com.cache._('#filter_file_errors').off().on('click', function () {
                    if (com.cache._(this).is(':checked')) {
                        var filter = [{field: 'errors', type: '>', value: 0}];
                        com.cache._(com.options.targetTable).tabulator('setFilter', filter);
                    } else {
                        com.cache._(com.options.targetTable).tabulator('clearFilter');
                    }
                });

                // Strings errors filter
                com.cache._('#filter_string_errors').off().on('click', function () {
                    if (com.cache._(this).is(':checked')) {
                        var filter = [{field: 'is_error', type: '=', value: '1'}];
                        com.cache._(com.options.targetTable).tabulator('setFilter', filter);
                    } else {
                        com.cache._(com.options.targetTable).tabulator('clearFilter');
                    }
                });
            },

            createOptions: function (com, sel, arr) {
                // Prepare the options
                var output = [];
                $.each(arr, function (key, value) {
                    // Create the option
                    var option = '<option value="' + value + '">' + value + '</option>';
    
                    // Add it to the output
                    output.push(option);
                });

                // Append the options
                com.cache._(sel).children('option:not(:first)').remove();
                com.cache._(sel).append(output.join(''));
            },

            update: function (com, newFilter) {
                // Get the existing filters
                var filters = $(com.options.targetTable).tabulator('getFilters');
                var found = filters.find(function (element) {
                    return element.field == newFilter.field;
                });
    
                // Process the new filter
                if (filters.length == 0 || typeof found === 'undefined') {
                    filters.push(newFilter);
                } else {
                    for (var i = 0; i < filters.length; i++) {
                        if (filters[i].field == newFilter.field) {
                            if (newFilter.value === 'alltx') {
                                filters.splice(i, 1);
                            } else if (newFilter.value !== 'alltx' && newFilter.field === filters[i].field) {
                                filters[i] = newFilter;
                            }
                        } else if (filters[i].field == newFilter.field && newFilter.value !== 'alltx') {
                            filters.push(newFilter);
                        }
                    }
                }
    
                // Clear filters and set the new one
                com.cache._(com.options.targetTable).tabulator('clearFilter');
                com.cache._(com.options.targetTable).tabulator('setFilter', filters);
            }
        };
    }
);