namespace :templates do
  desc 'Create templates for each screen'
  task create: :environment do
    Screen.all.each do |screen|
      full_template_path = Rails.root.join('app', 'views', screen.template_path)
      unless File.file?(full_template_path)
        FileUtils.touch(full_template_path)
        puts "- Created #{screen.template_path}"
      end
    end
  end

  task check: :environment do
    should_exist_templates = Screen.all.pluck :template
    templates_path = Rails.root.join('app', 'views', Screen::TEMPLATES_PATH)
    Dir.entries(Rails.root.join('app', 'views', 'screens', 'game')).each do |entry|
      next if %W{ . .. .DS_Store }.include?(entry)
      template_name = entry.split('.').first
      unless should_exist_templates.include?(template_name)
        puts "- Found app/views/screens/game/#{entry} and should be removed"
      end
    end
  end

end
