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
        'Magento_Ui/js/modal/prompt',
        'Naxero_Translation/js/translation/core',
        'mage/url',
        'mage/translate',
        'jquery/ui'
    ],
    function ($, prompt, core, url,  __) {
        'use strict';

        // Return the component
        return {
            importData: function (com) {
                // Prepare the data
                var requestData = {
                    block_type: 'prompt',
                    template_name: 'import-data',
                    form_key: window.FORM_KEY
                };

                // Send the request
                $.ajax({
                    type: 'POST',
                    url: com.options.promptUrl,
                    showLoader: true,
                    data: requestData,
                    success: function (data) {
                        // Trigger the prompt
                        prompt({
                            title: __('Import translation data'),
                            content: data.html,
                            actions: {
                                confirm: function () {
                                    // Prepare the form data
                                    var fileData = $('#new_file_import')[0].files[0];

                                    // Trigger the import request
                                    core.importFile(com, fileData, com.detailViewId);
                                },
                                cancel: function () {},
                                always: function () {}
                            },
                            opened: function () {
                                $('button.action-accept').prop('disabled', true);
                            }
                        });

                        // Add the validation checks
                        $('#new_file_import').on('change', function () {
                            var val = $(this).val().replace(' ', '');
                            val.length == 0
                            ? $('button.action-accept').prop('disabled', true)
                            : $('button.action-accept').prop('disabled', false);
                        });
                    },
                    error: function (request, status, error) {
                        console.log(error);
                    }
                });
            },

            newFile: function (com) {
                // Prepare the data
                var self = this;
                var requestData = {
                    block_type: 'prompt',
                    template_name: 'new-file',
                    form_key: window.FORM_KEY
                };

                // Send the request
                $.ajax({
                    type: 'POST',
                    url: com.options.promptUrl,
                    showLoader: true,
                    data: requestData,
                    success: function (data) {
                        // Trigger the prompt
                        prompt({
                            title: __('New translation file'),
                            content: data.html,
                            actions: {
                                confirm: function () {
                                    core.createFile(
                                        com,
                                        {
                                            file_path: $('#new_file_path').val(),
                                            file_name: $('#new_file_name').val()
                                        }
                                    );
                                },
                                cancel: function () {},
                                always: function () {}
                            },
                            opened: function () {
                                $('button.action-accept').prop('disabled', true);
                            }
                        });

                        // Prepare the autocomplete fields variables
                        var filePathList = [];
                        var fileNameList = [];
                        var tableRows = com.cache._(com.options.targetTable).tabulator('getRows');

                        // Build the autocomplete data
                        tableRows.forEach(function (row) {
                            // Prepare the variables
                            var filePath = row.getData().file_path;
                            var pathArray = filePath.split('/');
                            var fileName = pathArray[pathArray.length - 1];
                            var cleanFilePath = filePath.replace(fileName, '');

                            // Add the file path
                            if (filePathList.indexOf(cleanFilePath) == -1) {
                                filePathList.push(cleanFilePath);
                            }
                    
                            // Add the file name
                            if (fileNameList.indexOf(fileName) == -1) {
                                fileNameList.push(fileName);
                            }
                        });

                        // Initialize the autocomplete fields
                        self.initAutocompleteFields([
                            {id: 'new_file_path', source: filePathList},
                            {id: 'new_file_name', source: fileNameList}
                        ]);
                    },
                    error: function (request, status, error) {
                        console.log(error);
                    }
                });
            },

            initAutocompleteFields: function (fieldsArray) {
                // Initialise the widgets
                fieldsArray.forEach(function (field) {
                    $('#' + field.id).autocomplete({
                        source: field.source,
                        open: function (event, ui) {
                            $(this).autocomplete('widget').css({
                                'width': ($(this).width() + 'px')
                            });
                        }
                    });

                    // Add the validation checks
                    $('#' + field.id).on('input', function () {
                        // Prepare the variables
                        var isEmpty = 0;

                        // Loop through the fields
                        $('input[name^="new_file_"]').each(function (i) {
                            var val = $(this).val().replace(' ', '');
                            if (val.length === 0) {
                                isEmpty++;
                            }
                        });

                        // Set the confirmation button state
                        isEmpty == 0
                        ? $('button.action-accept').prop('disabled', false)
                        : $('button.action-accept').prop('disabled', true);
                    });
                });
            },

            newScan: function (com) {
                // Prepare the data
                var requestData = {
                    block_type: 'prompt',
                    template_name: 'scan-files',
                    form_key: window.FORM_KEY
                };

                // Send the request
                $.ajax({
                    type: 'POST',
                    url: com.options.promptUrl,
                    showLoader: true,
                    data: requestData,
                    success: function (data) {
                        // Trigger the prompt
                        prompt({
                            title: __('Scan files'),
                            content: data.html,
                            actions: {
                                confirm: function () {
                                    var optChecked = com.cache._('input[name=update_mode]:checked').val();
                                    core.updateFileIndex(com, optChecked);
                                },
                                cancel: function (){},
                                always: function (){}
                            }
                        });
                    },
                    error: function (request, status, error) {
                        console.log(error);
                    }
                });
            }
        };
    }
);