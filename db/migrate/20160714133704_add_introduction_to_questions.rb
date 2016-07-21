class AddIntroductionToQuestions < ActiveRecord::Migration[5.0]
  def change
    add_column :questions, :introduction, :text
  end
end
