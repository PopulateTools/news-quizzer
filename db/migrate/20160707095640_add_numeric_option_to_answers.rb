class AddNumericOptionToAnswers < ActiveRecord::Migration[5.0]
  def change
    add_column :answers, :numeric_option, :float
  end
end
