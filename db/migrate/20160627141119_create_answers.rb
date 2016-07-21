class CreateAnswers < ActiveRecord::Migration[5.0]
  def change
    create_table :answers do |t|
      t.references :session
      t.references :question
      t.text :options, null: false
      t.integer :took, null: false
      t.boolean :correct, null: false
      t.integer :question_points
      t.integer :time_points

      t.timestamps
    end
  end
end
