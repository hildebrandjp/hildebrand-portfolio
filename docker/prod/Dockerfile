ARG RUBY_VERSION=3.4.4
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# Install base packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libjemalloc2 libvips sqlite3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

ENV BUNDLE_PATH="/usr/local/bundle" \
    APP="/app"

FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libyaml-dev pkg-config && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

RUN mkdir -p $APP
COPY . $APP/

WORKDIR $APP

RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    npm install && gem install foreman && \
    mkdir -p _site/assets/js && \
    npm run build-js:prod

FROM base

COPY --from=build $BUNDLE_PATH $BUNDLE_PATH
COPY --from=build $APP $APP

WORKDIR $APP

# Install production dependencies only
RUN bundle install --without development test && \
    npm ci --only=production

EXPOSE 4000

CMD ["foreman", "start", "-f", "Procfile.dev"]
