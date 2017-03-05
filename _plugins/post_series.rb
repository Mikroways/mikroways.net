module Jekyll
  class PostSeriesTag < Liquid::Tag

    def number_to_ordinal(position)
      ordinals = {
        1 => 'primer',
        2 => 'segundo',
        3 => 'tercer',
        4 => 'cuarto',
        5 => 'quinto',
        6 => 'sexto',
        7 => 'séptimo',
        8 => 'octavo',
        9 => 'noveno',
        10 => 'décimo'
      }
      ordinals[position]
    end

    def number_name(number)
      names = {
        1 => 'un',
        2 => 'dos',
        3 => 'tres',
        4 => 'cuatro',
        5 => 'cinco',
        6 => 'seis',
        7 => 'siete',
        8 => 'ocho',
        9 => 'nueve',
        10 => 'diez'
      }
      names[number]
    end

    def render(context)
      site = context.registers[:site]
      page = context.registers[:page]
      current_series = page["series"]
      type = page["collection"]
      unless current_series.nil?
        collection = site.collections[type].docs.map do |item|
          if item.data["series"] && item.data["series"] == current_series
            item
          end
        end.compact

        idx = collection.find_index { |p| p.id == page["id"] } + 1

        <<-TEXT
<div class="post-series">
  Esta es la #{number_to_ordinal(idx)} parte de una serie de #{number_name(collection.size)} posts
  <ol>
        #{collection.each_with_index.map do |item, i|
        if (i + 1) == idx
          "<li>#{item.data["title"]}</li>"
        else
          "<li><a href=\"#{item.url}\">#{item.data["title"]}</a></li>"
        end
        end .join("") }
  </ol>
</div>
        TEXT
      end
    end
  end
end

Liquid::Template.register_tag('post_series', Jekyll::PostSeriesTag)
