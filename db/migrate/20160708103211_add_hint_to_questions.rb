class AddHintToQuestions < ActiveRecord::Migration[5.0]
  def change
    add_column :questions, :hint, :text
  end
end
