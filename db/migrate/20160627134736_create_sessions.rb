class CreateSessions < ActiveRecord::Migration[5.0]
  def change
    create_table :sessions do |t|
      t.string :nickname, index: true
      t.integer :age
      t.integer :country
      t.integer :seconds, null: false, default: 0
      t.integer :points, null: false, default: 0, index: true
      t.integer :ranking, null: false, default: 0
      t.boolean :completed, null: false, default: false, index: true

      t.timestamps
    end
  end
end
