class CreateScreens < ActiveRecord::Migration[5.0]
  def change
    create_table :screens do |t|
      t.string :slug, null: false, index: true, unique: true
      t.integer :position, null: false, uniq: true, index: true
      t.string :template, null: false, uniq: true, index: true
      t.integer :questions_count, default: 0
      t.timestamps
    end
  end
end
