<?php
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

namespace Naxero\CodeInjector\Setup;

use Magento\Framework\DB\Ddl\Table;

class InstallSchema implements \Magento\Framework\Setup\InstallSchemaInterface
{
    /**
     * Installs DB schema for the module
     *
     * @param SchemaSetupInterface $setup
     * @param ModuleContextInterface $context
     * @return void
     */
    public function install(
        \Magento\Framework\Setup\SchemaSetupInterface $setup,
        \Magento\Framework\Setup\ModuleContextInterface $context
    ) {
        $installer = $setup;
        $installer->startSetup();

        // Define the js code table
        $table1 = $installer->getConnection()
            ->newTable($installer->getTable('naxero_codeinjector_js'))
            ->addColumn(
                'file_id',
                Table::TYPE_INTEGER,
                null,
                ['identity' => true, 'nullable' => false, 'primary' => true],
                'File ID'
            )
            ->addColumn('is_readable', Table::TYPE_BOOLEAN, 1, [], 'Boolean')
            ->addColumn('is_writable', Table::TYPE_BOOLEAN, 1, [], 'Boolean')
            ->addColumn('file_path', Table::TYPE_TEXT, null, ['nullable' => true, 'default' => null])
            ->addColumn('file_content', Table::TYPE_TEXT, null, ['nullable' => true, 'default' => null])
            ->addColumn('rows_count', Table::TYPE_INTEGER, null, ['nullable' => false, 'default' => 0])
            ->addColumn('file_creation_time', Table::TYPE_DATETIME, null, ['nullable' => false], 'Creation Time')
            ->addColumn('file_update_time', Table::TYPE_DATETIME, null, ['nullable' => false], 'Update Time')
            ->addColumn('file_override', Table::TYPE_TEXT, null, ['nullable' => true, 'default' => null])
            ->addIndex($installer->getIdxName('translation_file_index', ['file_id']), ['file_id'])
            ->setComment('Naxero Translation Files');
        $installer->getConnection()->createTable($table1);

        // Define the css code table
        $table2 = $installer->getConnection()
            ->newTable($installer->getTable('naxero_codeinjector_css'))
            ->addColumn(
                'id',
                Table::TYPE_INTEGER,
                null,
                ['identity' => true, 'nullable' => false, 'primary' => true],
                'Record ID'
            )
            ->addColumn('file_id', Table::TYPE_INTEGER, null, ['nullable' => false], 'File ID')
            ->addColumn('row_id', Table::TYPE_INTEGER, null, ['nullable' => true], 'Row ID')
            ->addColumn('comments', Table::TYPE_TEXT, null, ['nullable' => true, 'default' => null])
            ->setComment('Naxero Translation Logs');
        $installer->getConnection()->createTable($table2);

        // En the setup
        $installer->endSetup();
    }
}
