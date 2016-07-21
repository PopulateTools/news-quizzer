class CreateQuestions < ActiveRecord::Migration[5.0]
  def change
    create_table :questions do |t|
      t.references :screen
      t.string :title
      t.string :type, null: false
      t.text :right_options
      t.text :options
      t.integer :points
      t.integer :position, null: false, uniq: true, index: true, default: 0

      t.timestamps
    end
  end
end
