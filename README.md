# NewsQuizzer



NewsQuizzer is a Rails application to easily create a storytelling-like game to challenge players to answer questions around a topic. Main features: 

- Simple multiple-choice questions
- Map, slider and fill-in-the-blanks questions
- Ranking, with drilldown
- Mobile optimised

The app was created to power the [Africa Offshore Game](https://panamapapers.icij.org/20160725-africa-offshore-game.html) in the context of [Panama Papers by ICIJ](https://panamapapers.icij.org/).

## Live demo

- [Live site](africaoffshoregame.icij.org)
- screenshots & screencast

## Getting started

### Requirements

Please, verify the following requirements. The app runs on Ruby 2.3+, Rails 5+ and MySQL, with no other external dependency. You have to install Rubygems and the gem Bundler in order to install the rest of the gems.

### Cloning repo and launching the application

1 - Go to [github.com/PopulateTools/news-quizzer](https://github.com/PopulateTools/news-quizzer) and download or clone the reopsitory

2 - Create the configuration files, based on the `.example` version:
  - `config/database.yml`, based on `config/database.yml.example`
  - `config/secrets.yml`, based on `config/secrets.yml.example`
  - `config/settings.yml`, based on `config/settings.yml.example`

3 - If you are planning to track the visits with some analytics tool create the following files: 
  - app/views/shared/_analytics_footer.html.erb
  - app/views/shared/_analytics_header.html.erb

### Creating and customizing the content

The game consists in a series of Screens that will be navigated by the user in order. Once the user
has started the game she can restar it whenever she wants, or complete it and see the points and the
ranking position.

Each screen can contain one or many questions. Each question can be _single choice_ or _multiple
choice_. In the `db/seeds.rb` file we have included the real list of screens and questions for the
Africa Offshore Game.

This is an extract:

```ruby
create_screen do
  template :start
end

create_screen do
  template :how_many_people

  create_question do
    type SingleChoiceQuestion
    title "How many people live in Africa?"
    introduction "Africa is the second most populous continent on the globe, with about 16% of the world’s population."
    points 200
    options '1.2 billion', '3.1 billion', '702 million', '443 million'
    right_options '1.2 billion'
    hint "The population of Africa is growing fast: According to the UN, more than half of global population growth between 2015 and 2050 is expected to occur in Africa."
  end
end
```

Screens are composed of a `template` and one or many `questions`. The order they have in the file is
the order the users will see them. The template attribute references a file in
`app/views/screens/game`. This template is the HTML the user will see when loading this screen.

Each question is composed of:

- type: it can be `SingleChoiceQuestion` or `MultipleChoiceQuestion`
- a title
- an introduction
- the number of points the user wins
- the different options
- the right options
- a hint text

Each question is created **inside a screen** and it also has an order. Look to the example templates
to see how to show the options of a question. You'll need to know a bit of Ruby.

Also, there is a default template in `screens/_single_choice_question.html.erb` with a basic HTML.

### Customizing look and feel

The application comes with a layout in [PureCSS](http://purecss.io) and a few styles. CSS files are
in `app/assets/stylesheets`. External CSSs are in `vendor/assets/stylesheets`. 

## Extend it

If you want to contribute and extend the application, please send a Pull Request with your changes
and we'll review them. Areas that can be improved are:

- add new types of questrions
- display results and rankings in a different way
- pack more visualizations
- support story branching (right now, the screens are thought to describe a linear story)

## Credits

- Original Idea: [ICIJ](http://www.icij.org)
- UX Design & Development: Fernando Blat, Jorge Sancha and Álvaro Ortiz from [Populate](http://populate.tools)
- Funding: [The Pulitzer Center](http://pulitzercenter.org/)
