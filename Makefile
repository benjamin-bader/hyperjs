OUTDIR=bin
LIB=$(OUTDIR)/hyper.js
CATTED=$(OUTDIR)/catted.js

CLEVEL = SIMPLE_OPTIMIZATIONS
CFLAGS = --compilation_level $(CLEVEL) --js_output_file $(LIB)
COMPILE = closure-compiler $(CFLAGS)

SOURCES := $(shell cat BUILD_ORDER | tr '\n' ' ')

all: build test-compiled

clean:
	@if [ -d $(OUTDIR) ]; then rm -rf $(OUTDIR); fi

build: $(LIB)

$(LIB): $(CATTED)
	$(COMPILE) --js $<
	@rm $<

test: clean $(CATTED)
	@jasmine-headless-webkit -j spec/jasmine.yml

test-compiled: $(LIB)
	@jasmine-headless-webkit -j spec/jasmine.yml

$(CATTED): $(SOURCES) | $(OUTDIR)
	@> $@
	@for FILE in $(SOURCES); do cat $$FILE >> $@; done

$(OUTDIR):
	@test -d $@ || mkdir $@

