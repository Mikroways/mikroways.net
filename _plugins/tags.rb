module TagSystem
  class TagPage < Jekyll::Page
    def initialize(site, base, category, posts)
      @site = site
      @base = base
      @dir = 'tags'
      @name = "#{category}.html"

      process(@name)
      read_yaml(File.join(base), 'blog.html')
      data['tag_view'] = true
      data['tag'] = category
      data['posts'] = posts
      data['title'] = "Entradas con la etiqueta: #{category}"
    end
  end

  class Tags < Jekyll::Generator
    def generate(site)
      site.tags.each do |tag, posts|
        site.pages << TagPage.new(site, site.source, tag, posts.reverse)
      end
    end
  end
end
