
namespace :performance do
  task test_data: :environment do
    500.times do
      Session.create! points: rand(10_000), completed: true, seconds: rand(600_000), nickname: rand(36**6).to_s(36), country: ISO3166::Country.all.sample.number, age: rand(80) + 1
    end
  end

  desc 'Load data'
  task load_data: :environment do
    conn = ActiveRecord::Base.connection
    date = Time.now.strftime('%Y-%m-%d')
    1_000.times do |i|
      sql = <<-SQL
INSERT INTO `sessions` (`points`, `created_at`, `updated_at`, `completed`)
VALUES (#{rand(10_000)}, '#{date} 13:54:07', '#{date} 13:54:07', 1)
SQL
      conn.execute(sql)
    end

    ## Get score of a single session with ID=3
    #select s1.id, s1.points, count(*) as rank from sessions as s1 join sessions as s2 on s1.points < s2.points where s1.id = 3;
  end

  desc 'Load data'
  task load_huge_data: :environment do
    conn = ActiveRecord::Base.connection
    date = Time.now.strftime('%Y-%m-%d')
    3_000_000.times do |i|
      sql = <<-SQL
INSERT INTO `sessions` (`points`, `created_at`, `updated_at`)
VALUES (#{rand(10_000)}, '#{date} 13:54:07', '#{date} 13:54:07')
SQL
      conn.execute(sql)
    end
  end

end
