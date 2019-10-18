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

namespace Naxero\Translation\Setup;

use Magento\Framework\DB\Ddl\Table;

class UpgradeSchema implements \Magento\Framework\Setup\UpgradeSchemaInterface
{
    /**
     * Upgrades DB schema for the module
     *
     * @param SchemaSetupInterface $setup
     * @param ModuleContextInterface $context
     * @return void
     */
    public function upgrade(
        \Magento\Framework\Setup\SchemaSetupInterface $setup,
        \Magento\Framework\Setup\ModuleContextInterface $context
    ) {
        $installer = $setup;
        $installer->startSetup();
        $tableName1 = 'naxero_translation_files';
        $tableName2 = 'naxero_translation_logs';

        // Create the files table schema
        if ($installer->getConnection()->isTableExists($tableName1) != true) {
            $table1 = $installer->getConnection()
                ->newTable($installer->getTable($tableName1))
                ->addColumn(
                    'file_id',
                    Table::TYPE_INTEGER,
                    null,
                    ['identity' => true, 'nullable' => false, 'primary' => true],
                    'File ID'
                )
                ->addColumn('is_readable', Table::TYPE_BOOLEAN, 1, [], 'Boolean')
                ->addColumn('is_writable', Table::TYPE_BOOLEAN, 1, [], 'Boolean')
                ->addColumn('file_path', Table::TYPE_TEXT, 255, ['nullable' => true, 'default' => null])
                ->addColumn('file_content', Table::TYPE_TEXT, null, ['nullable' => true, 'default' => null])
                ->addColumn('rows_count', Table::TYPE_INTEGER, null, ['nullable' => false, 'default' => 0])
                ->addColumn('file_creation_time', Table::TYPE_DATETIME, null, ['nullable' => false], 'Creation Time')
                ->addColumn('file_update_time', Table::TYPE_DATETIME, null, ['nullable' => false], 'Update Time')
                ->addIndex($installer->getIdxName('translation_file_index', ['file_id']), ['file_id'])
                ->setComment('Naxero Translation files');

            $installer->getConnection()->createTable($table1);
        }

        // Create the logs table schema
        if ($installer->getConnection()->isTableExists($tableName2) != true) {
            $table2 = $installer->getConnection()
                ->newTable($installer->getTable($tableName2))
                ->addColumn(
                    'id',
                    Table::TYPE_INTEGER,
                    null,
                    ['auto_increment' => true, 'identity' => true, 'nullable' => false, 'primary' => true],
                    'Record ID'
                )
                ->addColumn('file_id', Table::TYPE_INTEGER, null, ['nullable' => false], 'File ID')
                ->addColumn('row_id', Table::TYPE_INTEGER, null, ['nullable' => true], 'Row ID')
                ->addColumn('comments', Table::TYPE_TEXT, null, ['nullable' => true, 'default' => null])
                ->setComment('Naxero Translation Logs');
            $installer->endSetup();
        }
    }
}
